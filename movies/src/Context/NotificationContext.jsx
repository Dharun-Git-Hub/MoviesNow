import { createContext, useState } from "react";

export const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
    const [msg, setMsg] = useState(null);
    const [from, setFrom] = useState(null);
    const notify = (msg,from) => {
        setMsg(msg);
        setFrom(from);
    }
    return (
        <NotificationContext.Provider value={{ notify, msg, from, setMsg, setFrom }}>
        {children}
        </NotificationContext.Provider>
    );
};