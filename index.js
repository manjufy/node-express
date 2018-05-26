const express = require('express')
const Joi = require('joi')
// get express object
const app = express()

app.use(express.json())

// PORT environment variable. Read it from process
const port = process.env.PORT || 3000

const courses = [
	{ id: 1, name: 'Course 1'},
	{ id: 2, name: 'Course 2'},
	{ id: 3, name: 'Course 3'},
	{ id: 4, name: 'Course 4'}
]

app.get('/', (req, res) => {
	res.send('Huurary......')
})


app.get('/api/courses', (req, res) => {
	res.send([1, 2, 3, 4])
})

// :id is route paramater
// :id?sortBy=name is query string parameters
app.get('/api/courses/:id', (req, res) => {
	// Read route parameters
	// res.send(req.params)

	// read query string parameters
	// res.send(req.query)

	const course = courses.find( course => course.id === parseInt(req.params.id))

	if(!course) {
		res.status(404).send('The course with the given ID was not found')
	}

	res.send(course)
})

// create new course
app.post('/api/courses', (req, res) => {
	// validate user input
	const schema = {
		name: Joi.string().min(3).required()
	}

	const result = Joi.validate(req.body, schema)

	if (result.error) {
		res.status(400).send(result.error)
		return // NOTE: if not the script would continue to run and might get Error: Can't set headers after they are sent.
	}

	const course = {
		id: courses.length + 1,
		name: req.body.name
	}

	courses.push(course)

	res.send(course)
})

// update existing course
app.put('/api/courses/:id', (req, res) => {
	// check if the course exists
	const course = courses.find( course => course.id === parseInt(req.params.id))

	if(!course) {
		res.status(404).send('The course with the given ID was not found')
	}

	// validate the course
	const schema = {
		name: Joi.string().min(3).required()
	}

	const result = Joi.validate(req.body, schema)

	if (result.error) {
		res.status(400).send(result.error)
		return // NOTE: if not the script would continue to run and might get Error: Can't set headers after they are sent.
	}

	// update the course
	// find the index of the course
	const courseIndex = courses.findIndex(course => course.id == req.params.id)
	courses[courseIndex].name = req.body.name

	// return the course
	res.send(courses)
})

app.listen(port, () => {
	console.log(`Listening on port ${port}`)
})