const app = require('express')();
const cors = require('cors');
const server = require('http').Server(app);
const PORT = process.env.PORT || 3000;

const next = require ('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const socket = require('socket.io');
const io = socket(server);

io.set('origins', '*:*');
io.set('origins', '*');

nextApp.prepare()
	.then(() => {

		app.use(cors())

		app.get('*', (req, res) => {
			return nextHandler(req, res)
		})


		io.on("connection", socket => {
			console.log('connection made with socket', socket.id);

			socket.on('chat', data => {
				io.emit('chat', data);
				console.log(data)
			})

			socket.on('disconnect', () => console.log('disconnected from socket'));
		});

		server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
	})