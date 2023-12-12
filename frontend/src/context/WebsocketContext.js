import { useEffect, useState, createContext, useContext } from 'react';
import io from 'socket.io-client';
import { useUserContext } from './UserContext';


const WebSocketContext = createContext();
const serverUrl = 'http://localhost:5000/';

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)
    const [message, setMessage] = useState('')
    const { user } = useUserContext();

    useEffect(() => {
        const socketInstance = io(serverUrl, {
            query: { userId: user ? user._id : null }
        });

        socketInstance.on('connect', () => {
            console.log('WebSocket connected')
        })

        socketInstance.on('disconnect', () => {
            console.log('WebSocket disconnected')
        })

        socketInstance.on('orderCreated', (data) => {
            setMessage(data);
        });

        socketInstance.on('orderDeleted', (data) => {
            setMessage(data);
        });

        socketInstance.on('reconnect', () => {
            console.log('WebSocket reconnected')
        })

        socketInstance.on('error', (error) => {
            console.log('WebSocket error', error)
        })

        setSocket(socketInstance)

        return () => {
            if (socketInstance) {
                socketInstance.disconnect();
            }

        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);


    const sendMessage = (message) => {
        if (socket) {
            socket.emit('messageToServer', message)
        }
    }

    const value = {
        message,
        sendMessage
    }

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    )
};

export const useWebSocket = () => {
    return useContext(WebSocketContext)
}
