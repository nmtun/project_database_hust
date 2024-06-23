-- Bùi Quang Hưng:



-- Truy vấn:
--Đưa ra các khách sạn có ít nhất một phòng ‘Luxury’ trống và đưa ra phòng đó
SELECT
    h.hotel_id,
    h.name AS hotel_name,
    r.room_id,
    r.room_number,
    r.room_price,
    r.room_class
FROM
    hotels h
JOIN
    rooms r ON h.hotel_id = r.hotel_id
LEFT JOIN
    bookings b ON r.room_id = b.room_id 
        AND CURRENT_DATE BETWEEN b.check_in_date AND b.check_out_date
WHERE
    h.city = 'Hai Phong'
    AND r.room_class = 'Luxury'
    AND b.booking_id IS NULL;

--Thống kê tỉ lệ sử dụng theo từng phương thức thanh toán của khách hàng
SELECT 
    payment_method,
    COUNT(*) AS payment_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) AS percentage
FROM payments
GROUP BY payment_method
ORDER BY payment_count DESC;

--Thống kê lượng đặt phòng (>2) theo từng tháng của mỗi khách sạn
SELECT
    h.name AS hotel_name,
    DATE_PART('month', b.check_in_date) AS month,
    COUNT(*) AS bookings_count
FROM
    hotels h
JOIN
    bookings b ON h.hotel_id = b.hotel_id
GROUP BY
    h.name, DATE_PART('month', b.check_in_date)
HAVING
    COUNT(*) > 2
ORDER BY
    hotel_name, month;

-- View:
-- Tổng doanh thu cho từng khách sạn
CREATE OR REPLACE VIEW top_5_hotel_revenue AS
WITH hotel_revenue_summary AS (
    SELECT
        h.hotel_id,
        h.name AS hotel_name,
        SUM(p.amount) AS total_revenue,
        RANK() OVER (ORDER BY SUM(p.amount) DESC) AS revenue_rank
    FROM
        hotels h
    JOIN
        bookings b ON h.hotel_id = b.hotel_id
    JOIN
        payments p ON b.booking_id = p.booking_id
    GROUP BY
        h.hotel_id, h.name
)
SELECT
    hotel_id,
    hotel_name,
    total_revenue,
    revenue_rank
FROM
    hotel_revenue_summary
WHERE
    revenue_rank <= 5
ORDER BY
    total_revenue DESC;
select * from top_5_hotel_revenue;



-- Function:
-- Viết hàm khi nhập tên khách sạn, đưa ra thông tin về khách hàng đã thuê phòng của khách sạn đó
CREATE OR REPLACE FUNCTION get_customer_booking_info(
    hotel_name VARCHAR(100)
)
RETURNS TABLE (
    customer_id INT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    check_in_date DATE,
    check_out_date DATE
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.customer_id,
        c.first_name,
        c.last_name,
        b.check_in_date,
        b.check_out_date
    FROM customers c
    JOIN bookings b ON c.customer_id = b.customer_id
    JOIN hotels h ON b.hotel_id = h.hotel_id
    WHERE h.name = hotel_name;
END;
$$ LANGUAGE plpgsql;
SELECT * FROM get_customer_booking_info('Khach san Rex');

-- Viết hàm đưa ra khách hàng đi du lịch từ tỉnh A đến tỉnh B
CREATE OR REPLACE FUNCTION get_customers_travel_from_to(province_a VARCHAR, province_b VARCHAR)
RETURNS TABLE (
    first_name VARCHAR,
    last_name VARCHAR,
    home_address VARCHAR,
    travel_address VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.first_name,
        c.last_name,
        c.city AS home_address,
        h.city AS travel_address
    FROM customers c
    JOIN bookings b ON c.customer_id = b.customer_id
    JOIN hotels h ON b.hotel_id = h.hotel_id
    WHERE c.city = province_a
    AND h.city = province_b
    ORDER BY c.first_name, c.last_name;
END;
$$ LANGUAGE plpgsql;
SELECT * FROM get_customers_travel_from_to('Ha Noi', 'Ho Chi Minh');

-- Viết hàm thống kê doanh thu theo tháng bất kì của khách sạn nào đó
CREATE OR REPLACE FUNCTION calculate_monthly_revenue_by_name_and_month(
    hotel_name VARCHAR(100),
    target_month INT,
    target_year INT
)
RETURNS TABLE(revenue DECIMAL(10, 2)) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        SUM(p.amount) AS revenue
    FROM 
        bookings b
        JOIN payments p ON b.booking_id = p.booking_id
        JOIN hotels h ON b.hotel_id = h.hotel_id
    WHERE 
        h.name = hotel_name
        AND EXTRACT(MONTH FROM b.check_in_date) = target_month
        AND EXTRACT(YEAR FROM b.check_in_date) = target_year;
END;
$$ LANGUAGE plpgsql;
SELECT * FROM calculate_monthly_revenue_by_name_and_month('Khach san Rex', 6, 2024);



-- Trigger: 
-- Khi update payment_date và payment_method cập nhật payment_status = ‘Completed’
CREATE OR REPLACE FUNCTION trg_update_payment_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_date IS DISTINCT FROM OLD.payment_date AND NEW.payment_method IS DISTINCT FROM OLD.payment_method THEN
        UPDATE payments
        SET payment_status = 'Completed'
        WHERE payment_id = NEW.payment_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER update_payment_status
BEFORE UPDATE OF payment_date, payment_method ON payments
FOR EACH ROW
EXECUTE FUNCTION trg_update_payment_status();



-- Index:
-- tìm kiếm các đặt phòng trong một khách sạn theo khoảng thời gian nhất định 
CREATE INDEX idx_bookings_hotel_id_check_in_date ON bookings (hotel_id, check_in_date);