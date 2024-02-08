const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');

const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const port = 3000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const prisma = new PrismaClient();

const io = new Server(server, {
    cors: {
        origin: '*',
    }
});


io.on('connection', (socket) => {
    console.log('a user connected with a socket id = ' + socket.id);

    socket.on('join', (data) => {
        // Join a specific chat room based on the chat ID
        const chatId = data.chatId;
        socket.join(chatId);
        console.log(`User with socket id ${socket.id} joined chat ${chatId}`);
    });

    socket.on('message', async (data) => {
        console.log('message: ' + data.message);
        const savedMessage = await saveMessageToDatabase(data);

        // send the message to all the users in the chat
        io.to(data.chatId).emit('message', savedMessage);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

async function saveMessageToDatabase(data) {
    try {
        const { chatId, user_id, message } = data;

        // Find the user and chat based on their IDs
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(user_id),
            },
        });

        const chat = await prisma.chat.findUnique({
            where: {
                id: parseInt(chatId),
            },
        });

        if (!user || !chat) {
            throw new Error('User or chat not found');
        }

        // Create a new message and associate it with the user and chat
        const savedMessage = await prisma.message.create({
            data: {
                chat: {
                    connect: {
                        id: parseInt(chatId),
                    },
                },
                sender: {
                    connect: {
                        id: parseInt(user_id),
                    },
                },
                text: message,
                time: new Date(),
            },
        });

        return savedMessage;
    } catch (error) {
        console.error('Error saving message to the database:', error);
        throw error;
    }
}

app.get('/', (req, res) => {
    res.send('Hello World');
}
);

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    if (user.password === password) {
        res.status(200).send({
            "message": "Login successful",
            "user_id": user.id,
        });
    } else {
        res.status(401).send({
            "message": "Login failed",
        });
    }
}
);

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: password,
        },
    })
    if (user) {
        res.status(201).send({
            "message": "User created",
            "user_id": user.id,
        });
    }
    else {
        res.status(400).send({
            "message": "User not created",
        });
    }
}
);

app.post('/chat/create', async (req, res) => {
    try {
        // Assuming the request body contains the user_id and chat_name
        const { user_id, chat_name } = req.body;

        const parsed_user_id = parseInt(user_id);


        // Check if the user exists
        const user = await prisma.user.findUnique({
            where: {
                id: parsed_user_id,
            },
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Create a new chat and connect the user to it
        const chat = await prisma.chat.create({
            data: {
                chatName: chat_name,
                users: {
                    connect: {
                        id: parsed_user_id,
                    },
                },
            },
        });

        res.status(201).json({
            message: "Chat created successfully",
            chat_id: chat.id,
        });
    } catch (error) {
        console.error("Error creating chat:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

app.post('/chat/join', async (req, res) => {
    try {
        // Assuming the request body contains the user_id and chat_id
        const { user_id, chat_id } = req.body;

        const parsed_user_id = parseInt(user_id);
        const parsed_chat_id = parseInt(chat_id);

        // Check if the user and chat exist
        const user = await prisma.user.findUnique({
            where: {
                id: parsed_user_id,
            },
        });

        const chat = await prisma.chat.findUnique({
            where: {
                id: parsed_chat_id,
            },
        });

        if (!user || !chat) {
            return res.status(404).json({
                message: "User or chat not found",
            });
        }

        // Check if the user is already in the chat
        const isUserInChat = await prisma.chat.count({
            where: {
                id: parsed_chat_id,
                users: {
                    some: {
                        id: parsed_user_id,
                    },
                },
            },
        });

        if (isUserInChat > 0) {
            return res.status(400).json({
                message: "User is already in the chat",
            });
        }

        // Update the chat model to connect the user to the chat
        const updatedChat = await prisma.chat.update({
            where: {
                id: parsed_chat_id,
            },
            data: {
                users: {
                    connect: {
                        id: parsed_user_id,
                    },
                },
            },
            include: {
                users: true, // Include the details of the users in the response
            },
        });

        res.status(200).json({
            message: "User joined chat successfully",
            chat_id: updatedChat.id,
            users: updatedChat.users,
        });
    } catch (error) {
        console.error("Error joining chat:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});


app.get('/chats/:user_id', async (req, res) => {
    try {
        const user_id = parseInt(req.params.user_id);
        const user = await prisma.user.findUnique({
            where: {
                id: user_id,
            },
            include: {
                chats: {
                    include: {
                        users: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json(user.chats);
    } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});