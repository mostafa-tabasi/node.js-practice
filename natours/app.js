const fs = require("fs");
const express = require("express");
const app = express();

// the middleware we need to read the request body
app.use(express.json());

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/tours-simple.json`)
);

app.get("/api/v1/tours", (req, res) => {
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: { tours }
    });
});

app.get("/api/v1/tours/:id", (req, res) => {
    const id = req.params.id * 1 //to convert the number string to int
    const tour = tours.find(el => el.id === id)

    // tour validity solution #1
    if (!tour) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        })
    }

    res.status(200).json({
        status: "success",
        data: {
            tour
        }
    })
})

app.post("/api/v1/tours", (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);

    fs.writeFile(
        `${__dirname}/dev-data/tours-simple.json`,
        JSON.stringify(tours),
        err => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour
                }
            })
        })
});

app.patch("/api/v1/tours/:id", (req, res) => {
    const tourId = req.params.id * 1
    // tour validity solution #2
    if (tourId > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        })
    }

    // for learning porpuses we didn't implement the actual logic
    // just a place holder
    res.status(200).json({
        status: "success",
        data: {
            tour: "<Updated tour data here...>"
        }
    })
})

app.delete("/api/v1/tours/:id", (req, res) => {
    const tourId = req.params.id * 1
    // tour validity solution #2
    if (tourId > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        })
    }

    // for learning porpuses we didn't implement the actual logic
    // just a place holder
    res.status(204).json({
        status: "success",
        data: null
    })
})

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});