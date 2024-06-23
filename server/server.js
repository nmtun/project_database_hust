require("dotenv").config();
const express = require ("express");
const cors = require("cors")
const db = require('./db');
const morgan = require ("morgan");
const app = express();

app.use(cors());
app.use(express.json())

//Get all hotels
app.get("/api/v1/hotels" , async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM get_distinct_hotels_and_rooms () ORDER BY room_class, room_price");
        res.json({
            status: "success",
            result: result.rows.length,
            data: {
                hotels: result.rows,
            },
        });
    } catch (error) {
        console.log(err);
    }
});

//Get a hotel
app.get("/api/v1/hotels/:hotel_id/:room_class" , async (req, res) => {
    try {
        const { hotel_id, room_class } = req.params;
        const result = await db.query("SELECT * FROM get_distinct_hotels_and_rooms() WHERE hotel_id = $1 AND room_class = $2 ORDER BY room_class", [hotel_id, room_class]);
        res.json({
            status: "success",
            result: result.rows.length,
            data: {
                hotels: result.rows,
            },
        });
    } catch (error) {
        console.log(err);
    }
});

//Get some hotels
app.get("/api/v1/hotels/rating/:rating" , async (req, res) => {
    try {
        const {rating} = req.params
        const result = await db.query("SELECT * FROM hotels where rating = $1 ORDER BY hotel_id", [rating]);
        res.json({
            status: "success",
            result: result.rows.length,
            data: {
                hotels: result.rows,
            },
        });
    } catch (error) {
        console.log(err);
    }
});

//Create a user
app.post("/api/v1/customers", async (req, res) => {
    console.log(req.body);

    try {
        const result = await db.query("INSERT INTO customers (first_name, last_name, email, phone, city) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [req.body.first_name, req.body.last_name, req.body.email, req.body.phone, req.body.city]);
        // console.log(result); 
        
        res.status(201).json({
            status: "success",
            data: {
                users: result.rows[0],
            },
        });
    } catch (error) {
        console.log(err);
    }
});

//Get a room
app.get("/api/v1/hotels/rooms/:hotel_id/:room_class" , async (req, res) => {
    try {
        const { hotel_id, room_class } = req.params;
        const result = await db.query("SELECT * FROM get_available_room ($1, $2, $3, $4)", [hotel_id, room_class, req.body.dayStart, req.body.dayEnd]);
        res.json({
            status: "success",
            result: result.rows.length,
            data: {
                room: result.rows[0],
            },
        });
    } catch (error) {
        console.log(err);
    }
});

//Create a booking
app.post("/api/v1/customers/booking", async (req, res) => {
    console.log(req.body);
    try {
        const result = await db.query("INSERT INTO bookings (customer_id, hotel_id, room_id, check_in_date , check_out_date, total_price) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
            [req.body.customer_id, req.body.hotel_id, req.body.room_id, req.body.dayStart, req.body.dayEnd, req.body.total_price]);
        // console.log(result); 
        
        res.status(201).json({
            status: "success",
            data: {
                booking: result.rows[0],
            },
        });
    } catch (error) {
        console.log(err);
    }
});

//Get all booking
app.get("/api/v1/hotels/bookings" , async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM get_booking_details() ORDER BY booking_id DESC");
        res.json({
            status: "success",
            result: result.rows.length,
            data: {
                booking: result.rows,
            },
        });
    } catch (error) {
        console.log(err);
    }
});


//Delete

app.delete("/api/v1/hotels/:id", async(req, res)=> {
    try {
        const result = db.query("DELETE FROM bookings WHERE booking_id = $1", [req.params.id]);

        res.status(204).json({
            status: "success",
        });

    } catch (error) {
        console.log(err);
    }
    
});

//Get a booking
app.get("/api/v1/hotels/booking/detail/:booking_id" , async (req, res) => {
    try {
        const { booking_id } = req.params;
        const result = await db.query("SELECT * FROM get_booking_details() WHERE booking_id = $1", [booking_id]);
        res.json({
            status: "success",
            result: result.rows.length,
            data: {
                booking: result.rows,
            },
        });
    } catch (error) {
        console.log(err);
    }
});


//Update customer information
app.put("/api/v1/hotels/booking/detail/:booking_id/update", async (req, res) => {
    try {
        const { booking_id } = req.params;
        const { customer_id, first_name, last_name, email, phone } = req.body;

        // Log the received request data
        console.log('Request Data:', { booking_id, customer_id, first_name, last_name, email, phone });

        // First, fetch the customer_id from the bookings table based on the booking_id
        const bookingResult = await db.query("SELECT customer_id FROM bookings WHERE booking_id = $1", [booking_id]);

        if (bookingResult.rows.length === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }

        const customerIdFromBooking = bookingResult.rows[0].customer_id;

        // Log the customer_id fetched from the bookings table
        console.log('Customer ID from Booking:', customerIdFromBooking);

        // Now, update the customer information based on the customer_id fetched from the bookings table
        const result = await db.query(
            "UPDATE customers SET first_name = $1, last_name = $2, email = $3, phone = $4 WHERE customer_id = $5 RETURNING *",
            [first_name, last_name, email, phone, customerIdFromBooking]
        );

        // const update = await db.query(
        //     "UPDATE bookings SET check_in_date = $1, check_out_date = $2, total_price = $3 RETURNING *",
        //     [req.body.check_in_date,req.body.check_out_date,req.body.total_price]
        // );
        const update = await db.query(
            "UPDATE bookings SET check_in_date = $1, check_out_date = $2 WHERE booking_id = $3 RETURNING *",
            [req.body.check_in_date,req.body.check_out_date, booking_id]
        );

        res.status(200).json({
            data: result.rows[0],
            booking: update.rows[0],
        });
    } catch (err) {
        console.log('Error:', err);
        res.status(500).json({
            error: "Something went wrong",
        });
    }
});




const port = process.env.PORT || 3005;
app.listen(port, () => {
    console.log(`Console is up and listening on port ${port}`);
});
