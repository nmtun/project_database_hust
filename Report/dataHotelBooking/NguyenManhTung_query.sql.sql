-- Nguyễn Mạnh Tùng:


-- Truy vấn:
-- Đưa ra tên khách sạn, địa chỉ, có phòng ‘Luxury’ rẻ nhất của từng thành phố
WITH cheapest_luxury_rooms AS (
    SELECT 
        h.city,
        MIN(r.room_price) AS min_price
    FROM hotels h
    INNER JOIN rooms r ON h.hotel_id = r.hotel_id
    WHERE r.room_class = 'Luxury'
    GROUP BY h.city
)

SELECT 
    h.name AS hotel_name,
    h.address AS hotel_address,
    clr.min_price AS cheapest_luxury_price
FROM hotels h
INNER JOIN rooms r ON h.hotel_id = r.hotel_id
INNER JOIN cheapest_luxury_rooms clr ON h.city = clr.city
WHERE r.room_class = 'Luxury' AND r.room_price = clr.min_price
ORDER BY h.city;

-- Đưa ra tên khách hàng ở Hà Nội, phòng khách sạn mà họ đã thuê
SELECT 
    c.customer_id,
    c.first_name || ' ' || c.last_name AS customer_name,
    c.email,
    c.phone,
    h.name AS hotel_name,
    r.room_number,
    b.check_in_date,
    b.check_out_date
FROM customers c
JOIN bookings b ON c.customer_id = b.customer_id
JOIN rooms r ON b.room_id = r.room_id
JOIN hotels h ON b.hotel_id = h.hotel_id
WHERE c.city = 'Ha Noi';

-- Liệt kê số phòng được đặt nhiều nhất (>1) của từng khách sạn ở Hà Nội
SELECT 
    h.name AS hotel_name,
    r.room_number,
    COUNT(b.booking_id) AS booking_count
FROM hotels h
JOIN rooms r ON h.hotel_id = r.hotel_id
JOIN bookings b ON r.room_id = b.room_id
JOIN customers c ON b.customer_id = c.customer_id
WHERE h.city = 'Ha Noi'
GROUP BY h.name, r.room_number
HAVING COUNT(b.booking_id) > 1
ORDER BY h.name, booking_count DESC;

-- Liệt kê phòng có ngày thuê dài nhất (>1) của mỗi khách sạn ở Hà Nội
WITH LongestBookedRooms AS (
    SELECT r.room_id, r.hotel_id,
           (b.check_out_date - b.check_in_date) AS booking_duration,
           ROW_NUMBER() OVER(PARTITION BY r.hotel_id ORDER BY (b.check_out_date - b.check_in_date) DESC) AS rn
    FROM rooms r
    JOIN bookings b ON r.room_id = b.room_id
    JOIN hotels h ON r.hotel_id = h.hotel_id
    WHERE h.city = 'Ha Noi'
),
MaxDurationPerHotel AS (
    SELECT hotel_id, room_id, booking_duration
    FROM LongestBookedRooms
    WHERE rn = 1 
)
SELECT h.name AS hotel_name, h.address AS hotel_address, r.room_number, m.booking_duration AS max_booking_duration
FROM MaxDurationPerHotel m
JOIN rooms r ON m.room_id = r.room_id
JOIN hotels h ON m.hotel_id = h.hotel_id
ORDER BY hotel_name;



-- View:

-- Danh sách cách phòng đang được đặt 
CREATE OR REPLACE VIEW booked_rooms AS
SELECT 
    r.room_id,
    r.room_number,
    r.room_class,
    r.room_price,
    h.hotel_id,
    h.name AS hotel_name,
    b.booking_id,
    b.customer_id,
    c.first_name AS customer_first_name,
    c.last_name AS customer_last_name,
    b.check_in_date,
    b.check_out_date
FROM 
    rooms r
JOIN 
    bookings b ON r.room_id = b.room_id
JOIN 
    hotels h ON r.hotel_id = h.hotel_id
JOIN 
    customers c ON b.customer_id = c.customer_id
WHERE 
    h.city = 'Ha Noi'A
    AND EXTRACT(MONTH FROM b.check_in_date) = 7;

select * from booked_rooms;



-- Function:

--Viết hàm khi nhập tên của khách hàng bất kì sẽ trả về lịch trình thuê phòng của khách hàng đó
CREATE OR REPLACE FUNCTION get_customer_booking_schedule_by_last_name(p_last_name VARCHAR(50))
RETURNS TABLE (
    booking_id INT,
    hotel_name VARCHAR,
    room_class VARCHAR,
    check_in_date DATE,
    check_out_date DATE,
    total_price DECIMAL(10, 2)
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        b.booking_id,
        h.name AS hotel_name,
        r.room_class,
        b.check_in_date,
        b.check_out_date,
        b.total_price
    FROM
        customers c
    JOIN
        bookings b ON c.customer_id = b.customer_id
    JOIN
        hotels h ON b.hotel_id = h.hotel_id
    JOIN
        rooms r ON b.room_id = r.room_id
    WHERE
        c.last_name = p_last_name;
END;
$$
LANGUAGE plpgsql;
select * from get_customer_booking_schedule_by_last_name('Van A');

-- Viết hàm tính tiền, khi nhập tên của khách hàng sẽ đưa ra tổng số tiền người đó đã chi
CREATE OR REPLACE FUNCTION calculate_total_spent_by_customer(
    customer_first_name character varying,
    customer_last_name character varying
)
RETURNS TABLE (
    hotel_name VARCHAR(100),
    total_spent DECIMAL(10, 2)
)
AS $$
BEGIN
    RETURN QUERY
    SELECT h.name AS hotel_name, SUM(b.total_price) AS total_spent
    FROM bookings b
    JOIN customers c ON b.customer_id = c.customer_id
    JOIN hotels h ON b.hotel_id = h.hotel_id
    WHERE c.first_name = customer_first_name
      AND c.last_name = customer_last_name
    GROUP BY h.name;
END;
$$ LANGUAGE plpgsql;
SELECT * FROM calculate_total_spent_by_customer('Nguyen', 'Van A');

-- Viết hàm khi nhập tên của khách sạn sẽ thống kê tỉ lệ khách thuê phòng ‘Classic’, ‘Standard’, ‘Luxury’  của khách sạn đó
CREATE OR REPLACE FUNCTION calculate_room_type_ratio(
    hotel_name VARCHAR
)
RETURNS TABLE (
    room_class VARCHAR(50),
    booking_count BIGINT,
    total_bookings BIGINT,
    booking_ratio DECIMAL(5, 2)
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.room_class,
        COUNT(b.booking_id) AS booking_count,
        SUM(COUNT(b.booking_id)) OVER ()::BIGINT AS total_bookings,
        ROUND(COUNT(b.booking_id) * 100.0 / SUM(COUNT(b.booking_id)) OVER (), 2) AS booking_ratio
    FROM bookings b
    JOIN hotels h ON b.hotel_id = h.hotel_id
    JOIN rooms r ON b.room_id = r.room_id
    WHERE h.name = hotel_name
    AND r.room_class IN ('Classic', 'Standard', 'Luxury')
    GROUP BY r.room_class
    ORDER BY r.room_class;
END;
$$ LANGUAGE plpgsql;
SELECT * FROM calculate_room_type_ratio('Khach san Melia Ha Noi');



-- Trigger: 

-- Cập nhật giá tiền thanh toán khi có thay đổi (ngày checkout, giá của phòng,…)
CREATE OR REPLACE FUNCTION trg_update_prices()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE bookings
    SET total_price = (NEW.check_out_date - NEW.check_in_date) * rooms.room_price
    FROM rooms
    WHERE bookings.room_id = rooms.room_id
      AND bookings.booking_id = NEW.booking_id;
    UPDATE payments
    SET amount = bookings.total_price
    FROM bookings
    WHERE payments.booking_id = bookings.booking_id
      AND payments.booking_id = NEW.booking_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER update_prices
AFTER UPDATE OF check_in_date, check_out_date ON bookings
FOR EACH ROW
WHEN (OLD.check_in_date IS DISTINCT FROM NEW.check_in_date OR OLD.check_out_date IS DISTINCT FROM NEW.check_out_date)
EXECUTE FUNCTION trg_update_prices();


-- Ngăn chặn đặt phòng quá mức 
CREATE OR REPLACE FUNCTION trg_prevent_double_booking()
RETURNS TRIGGER AS $$
DECLARE
    existing_booking INT;
BEGIN
    SELECT COUNT(*)
    INTO existing_booking
    FROM bookings
    WHERE room_id = NEW.room_id
      AND check_in_date <= NEW.check_out_date
      AND check_out_date >= NEW.check_in_date;
    IF existing_booking > 0 THEN
        RAISE EXCEPTION 'Không thể đặt phòng vì phòng đã được đặt trong khoảng thời gian này!';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER prevent_double_booking
BEFORE INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION trg_prevent_double_booking();

INSERT INTO bookings (customer_id, hotel_id, room_id, check_in_date, check_out_date, total_price) VALUES
(1, 1, 1, '2024-05-05', '2024-08-08', 450.00);



-- Index:
-- tăng tốc độ truy vấn khi tìm kiếm các khách sạn theo thành phố
CREATE INDEX idx_hotels_city ON hotels (city);




