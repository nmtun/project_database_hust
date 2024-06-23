-- Tạ Hồng Phúc:



-- Truy vấn:
-- Đưa ra tên khách sạn có lượng đặt phòng nhiều nhất
SELECT 
    h.name AS hotel_name,
    COUNT(b.booking_id) AS booking_count
FROM hotels h
JOIN rooms r ON h.hotel_id = r.hotel_id
JOIN bookings b ON r.room_id = b.room_id
GROUP BY h.name
ORDER BY booking_count DESC
LIMIT 1;
--Thống kê số lượng khách sạn của mỗi tỉnh
SELECT city, COUNT(*) AS hotel_count
FROM hotels
GROUP BY city
ORDER BY hotel_count DESC;
--Đưa ra các khách sạn có tổng doanh thu cao nhất trong năm hiện tại
WITH HotelRevenues AS (
    SELECT
        h.hotel_id,
        h.name AS hotel_name,
		h.city AS hotel_city,
        SUM(p.amount) AS total_revenue,
        EXTRACT(YEAR FROM b.check_in_date) AS booking_year
    FROM
        hotels h
        JOIN bookings b ON h.hotel_id = b.hotel_id
        JOIN payments p ON b.booking_id = p.booking_id
    WHERE
        EXTRACT(YEAR FROM b.check_in_date) = EXTRACT(YEAR FROM CURRENT_DATE) 
    GROUP BY
        h.hotel_id, h.name, booking_year
)
SELECT
    hotel_id,
    hotel_name,
	hotel_city,
    total_revenue
FROM
    HotelRevenues
WHERE
    total_revenue = (SELECT MAX(total_revenue) FROM HotelRevenues);



-- View:
-- Các phòng được thanh toán gần đây tại nha trang 
CREATE OR REPLACE VIEW paid_rooms_recent AS
SELECT 
    r.room_id,
    r.room_number,
    r.room_price,
    h.hotel_id,
    h.name AS hotel_name,
    h.address AS hotel_address,
    h.city AS hotel_city,
    h.country AS hotel_country,
    p.payment_id,
    p.payment_method,
    p.payment_date,
    p.payment_status,
    p.amount
FROM 
    rooms r
JOIN 
    bookings b ON r.room_id = b.room_id
JOIN 
    hotels h ON r.hotel_id = h.hotel_id
JOIN 
    payments p ON b.booking_id = p.booking_id
WHERE 
    p.payment_date >= CURRENT_DATE - INTERVAL '7 days' -- Thanh toán trong 7 ngày gần đây
    AND r.capacity < 10
	AND h.city = 'Nha Trang';
select * from paid_rooms_recent;



-- Function:
-- Viết hàm khi nhập vào giá tiền sẽ đưa ra các phòng có mức giá bé hơn hoặc bằng giá đó
CREATE OR REPLACE FUNCTION get_rooms_by_price(max_price DECIMAL(10, 2))
RETURNS TABLE (
    room_id INT,
    room_number VARCHAR(10),
    room_price DECIMAL(10, 2),
    hotel_id INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.room_id,
        r.room_number,
        r.room_price,
        r.hotel_id
    FROM
        rooms r
    WHERE
        r.room_price <= max_price;
END;
$$ LANGUAGE plpgsql;
SELECT * FROM get_rooms_by_price(90);

-- Viết hàm đưa ra khách hàng sử dụng thanh toán bằng phương thức X nhiều nhất
CREATE OR REPLACE FUNCTION calculate_payment_method_ratio(
    payment_method_name VARCHAR
)
RETURNS TABLE (
    payment_method VARCHAR(50),
    customer_count BIGINT,
    total_customers BIGINT,
    customer_ratio DECIMAL(5, 2)
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.payment_method,
        COUNT(DISTINCT b.customer_id) AS customer_count,
        (SELECT COUNT(DISTINCT customer_id) FROM bookings)::BIGINT AS total_customers,
        ROUND(COUNT(DISTINCT b.customer_id) * 100.0 / (SELECT COUNT(DISTINCT customer_id) FROM bookings), 2) AS customer_ratio
    FROM payments p
    JOIN bookings b ON p.booking_id = b.booking_id
    WHERE p.payment_method = payment_method_name
    GROUP BY p.payment_method;
END;
$$ LANGUAGE plpgsql;
SELECT * FROM calculate_payment_method_ratio('Internet Banking');

-- Viết hàm truy xuất danh sách các khách sạn và thông tin về các loại phòng có sẵn trong mỗi khách sạn
CREATE OR REPLACE FUNCTION get_distinct_hotels_and_rooms()
RETURNS TABLE (
    hotel_id INT,
    hotel_name VARCHAR(100),
    hotel_address VARCHAR(200),
    hotel_city VARCHAR(50),
    hotel_country VARCHAR(50),
    hotel_rating INT,
    room_class VARCHAR(50),
    room_price DECIMAL(10, 2),
    room_capacity INT
)
AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT ON (h.hotel_id, r.room_class)
        h.hotel_id,
        h.name AS hotel_name,
        h.address AS hotel_address,
        h.city AS hotel_city,
        h.country AS hotel_country,
        h.rating AS hotel_rating,
        r.room_class,
        r.room_price,
        r.capacity
    FROM
        hotels h
        JOIN rooms r ON h.hotel_id = r.hotel_id
    ORDER BY
        h.hotel_id, r.room_class;
END;
$$ LANGUAGE plpgsql;
SELECT * FROM get_distinct_hotels_and_rooms();

-- Viết hàm trả về danh sách các phòng có sẵn dựa trên các tham số đầu vào
CREATE OR REPLACE FUNCTION get_available_room(
    p_hotel_id INT,
    p_room_class VARCHAR(50),
    p_check_in_date DATE,
    p_check_out_date DATE
)
RETURNS TABLE (
    room_id INT,
    room_number VARCHAR(10),
    room_class VARCHAR(50),
    room_price DECIMAL(10, 2),
    hotel_id INT,
    capacity INT
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.room_id,
        r.room_number,
        r.room_class,
        r.room_price,
        r.hotel_id,
        r.capacity
    FROM
        rooms r
    WHERE
        r.hotel_id = p_hotel_id
        AND r.room_class = p_room_class
        AND r.room_id NOT IN (
            SELECT
                b.room_id
            FROM
                bookings b
            WHERE
                (b.check_in_date >= p_check_in_date AND b.check_in_date < p_check_out_date)
                OR (b.check_out_date > p_check_in_date AND b.check_out_date <= p_check_out_date)
                OR (b.check_in_date < p_check_in_date AND b.check_out_date > p_check_out_date)
        );
END;
$$ LANGUAGE plpgsql;
SELECT * FROM get_available_room(1, 'Luxury', '2025-08-20', '2025-08-25');



-- Trigger: 
-- Khi bảng bookings được thêm bản ghi, thêm tương ứng bản ghi ở bảng paymets với yêu cầu: payment_method = NULL, payment_date = NULL, payment_status = ‘In Progress’ và payments.amount = bookings.total_price
CREATE OR REPLACE FUNCTION trg_after_insert_bookings()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO payments (booking_id, payment_method, payment_date, payment_status, amount)
    VALUES (NEW.booking_id, NULL, NULL, 'In Progress', NEW.total_price);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER after_insert_bookings
AFTER INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION trg_after_insert_bookings();

INSERT INTO bookings (customer_id, hotel_id, room_id, check_in_date, check_out_date, total_price) VALUES
(1, 1, 1, '2024-05-05', '2024-08-07', 300.00);



-- Index:
-- cải thiện hiệu suất khi tìm kiếm các đơn đặt phòng của một khách hàng cụ thể
CREATE INDEX idx_bookings_customer_id ON bookings (customer_id);
