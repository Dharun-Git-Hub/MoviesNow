import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validateToken } from "../../Slices/ValidateSlice";
import "./Queries.css";
import { NotificationContext } from "../../Context/NotificationContext";
import { clear, increment } from "../../Slices/ClientNotify";

const Queries = ({ Strict }) => {
    const [myId, setMyId] = useState(null);
    const [userList, setUserList] = useState([]);
    const [publicMode, setPublicMode] = useState(false);
    const [messages, setMessages] = useState({});
    const [history, setHistory] = useState({});
    const [selectedUser, setSelectedUser] = useState("Admin");
    const [unread, setUnread] = useState(0);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const ws = useRef(null);
    const inputRef = useRef(null);
    const dispatch = useDispatch();
    const username = sessionStorage.getItem("username");
    const loadedMessages = useRef(false);
    const { notify } = useContext(NotificationContext);
    const isMounted = useRef(false);
    const count = useSelector((state) => state.client.count);

    useEffect(() => {
        if(!loadedMessages.current){
            const storedMessages = sessionStorage.getItem("chatMessages");
            if(storedMessages){
                try{
                    setMessages(JSON.parse(storedMessages));
                }
                catch(err){
                    console.error("Invalid messages in sessionStorage");
                }
            }
            loadedMessages.current = true;
        }
        dispatch(clear());
    }, []);

    useEffect(() => {
        setUnread(count);
    }, [count]);

    useEffect(() => {
        sessionStorage.setItem("chatMessages", JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(()=>{
        const doFirst = async () => {
            try{
                const result = await dispatch(validateToken(sessionStorage.getItem('token'))).unwrap()
                if(result === 'Something went Wrong!'){
                    sessionStorage.removeItem('token')
                    alert('Session Timeout Please Login !')
                }
            }
            catch(err){
                console.log(err)
                sessionStorage.removeItem('token')
                alert('Session Timeout Please Login !')
                navigate('/')
            }
        }
        doFirst()
    },[])

    useEffect(() => {
        const container = document.querySelector(".messages-area");
        container.scrollTop = container.scrollHeight;
    }, [message]);

    useEffect(() => {
        ws.current = new window.WebSocket("ws://localhost:8001");
        ws.current.onopen = () => {
            ws.current.send(
                JSON.stringify({ type: "My_Name", name: username })
            );
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "your_id") {
                setMyId(data.id);
            }
            if (data.type === "Type-Error") {
                alert(data.message);
            }
            if (data.type === "users_list") {
                setUserList(data.list || []);
            }
            if (data.type === "private_message") {
                const senderUsername = data.fromName;
                const stored = sessionStorage.getItem("chatMessages");
                const prevMessages = stored ? JSON.parse(stored) : {};
                const updated = {
                    ...prevMessages,
                    [senderUsername]: [
                        ...(prevMessages[senderUsername] || []),
                        {
                            text: data.message,
                            self: false,
                            username: senderUsername,
                        },
                    ],
                };
                sessionStorage.setItem("chatMessages", JSON.stringify(updated));
                if (isMounted.current) {
                    setMessages(updated);
                }
                dispatch(increment());
                notify(data.message, senderUsername);
                try {
                    const container = document.getElementById("msg-area");
                    if (container)
                        container.scrollTop = container.scrollHeight + 50;
                } catch (err) {
                    console.log(err);
                }
            }

            if (data.type === "public_message") {
                setMessage((prev) => ({
                    ...prev,
                    public: [
                        ...(prev.public || [],
                        {
                            from: data.from || "Anonymous",
                            username: data.fromName,
                            text: data.message,
                            self: false,
                        }),
                    ],
                }));
                setMessages((prev) => ({
                    ...prev,
                    public: [
                        ...(prev.public || []),
                        {
                            from: data.from || "Anonymous",
                            username: data.fromName,
                            text: data.message,
                            self: false,
                        },
                    ],
                }));
            }

            if (data.type === "private_image") {
                const senderUsername = data.fromName;
                const stored = sessionStorage.getItem("chatMessages");
                const prevMessages = stored ? JSON.parse(stored) : {};
                const updated = {
                    ...prevMessages,
                    [senderUsername]: [
                        ...(prevMessages[senderUsername] || []),
                        {
                            image: data.image,
                            self: false,
                            username: senderUsername,
                        },
                    ],
                };
                sessionStorage.setItem("chatMessages", JSON.stringify(updated));
                if (isMounted.current) {
                    setMessages(updated);
                }
                dispatch(increment());
                notify("Image", senderUsername);
                try {
                    const container = document.getElementById("msg-area");
                    if (container)
                        container.scrollTop = container.scrollHeight + 50;
                } catch (err) {
                    console.log(err);
                }
            }

            if (data.type === "Duplicate" && Strict) {
                console.log(data.message);
                alert(data.message);
                navigate(-1);
            }
        };
    }, [username]);

    useEffect(() => {
        console.log(messages);
    }, [messages]);

    useEffect(() => {
        console.log("History");
        console.log(history);
    }, [history]);

    useEffect(() => {
        if (sessionStorage.getItem("token")) {
        } else {
            alert("Login First to Continue");
            navigate("/");
        }
    });

    useEffect(() => {
        const doFirst = async () => {
            if (sessionStorage.getItem("token")) {
                try {
                    const result = await dispatch(
                        validateToken(sessionStorage.getItem("token"))
                    ).unwrap();
                    if (
                        result === "Token Invalid" ||
                        result === "Token Invalid or Expired"
                    )
                        sessionStorage.removeItem("token");
                } catch (err) {
                    console.log(err);
                }
            }
        };
        doFirst();
    }, [dispatch]);

    const sendMessage = (isPublic = false) => {
        if (!message.trim()) {
            alert("Type Something before Sending a Message");
            return;
        }
        if (isPublic) {
            setPublicMode(true);
            setSelectedUser(false);
            ws.current.send(
                JSON.stringify({ type: "public", from: username, message })
            );
            setMessages((prev) => ({
                ...prev,
                public: [
                    ...(prev.public || []),
                    {
                        from: myId,
                        username: username,
                        text: message,
                        self: true,
                    },
                ],
            }));
        } else if (selectedUser) {
            const toId = userList.find(
                (user) => user.name === selectedUser
            )?.id;
            if (!toId) return;

            ws.current.send(
                JSON.stringify({
                    type: "private",
                    from: username,
                    toId,
                    message,
                })
            );

            setMessages((prev) => ({
                ...prev,
                [selectedUser]: [
                    ...(prev[selectedUser] || []),
                    {
                        text: message,
                        self: true,
                        username,
                    },
                ],
            }));
            setMessage("");
        }
    };

    const handleExit = () => {
        ws.current.send(JSON.stringify({ type: "exit", id: myId }));
        navigate(-1);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") sendMessage(publicMode ? true : false);
    };

    const handleImageSend = (file) => {
        if (!file || !selectedUser) return;
        const reader = new FileReader();
        reader.onload = () => {
            ws.current.send(
                JSON.stringify({
                    type: "private_image",
                    from: username,
                    toId: userList.find((user) => user.name === selectedUser)
                        ?.id,
                    image: reader.result,
                })
            );
            setMessages((prev) => ({
                ...prev,
                [selectedUser]: [
                    ...(prev[selectedUser] || []),
                    { from: myId, image: reader.result, self: true },
                ],
            }));
            setHistory((prev) => ({
                ...prev,
                [selectedUser]: [
                    ...(prev[selectedUser] || []),
                    { from: myId, image: reader.result, self: true },
                ],
            }));
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="chat-app">
            <div className="sidebar">
                <div className="sidebar-header">Support</div>
                <button className="exit-btn" onClick={handleExit}>
                    Exit
                </button>
            </div>
            <div
                className="main-chat"
                style={{ backgroundColor: selectedUser ? "white" : "#1f1f1f" }}
            >
                <span
                    style={{
                        color: "white",
                        position: "fixed",
                        top: "50%",
                        right: "40%",
                        zIndex: "20",
                        fontSize: "25px",
                    }}
                >
                    {!selectedUser && "Support"}
                </span>
                <div className="chat-header">
                    <span className="welcome">
                        {selectedUser
                            ? `${
                                  userList.find((el) => el.id === selectedUser)
                                      ?.name || selectedUser
                              }`
                            : "Welcome to Support!"}
                    </span>
                </div>
                <div className="messages-area" id="msg-area">
                    <ul>
                        {(messages[selectedUser] || []).map((msg, id1) => (
                            <li
                                key={id1}
                                className={msg.self ? "msg-self" : "msg-other"}
                            >
                                <span>
                                    <b>{msg.username}</b> {msg.text}
                                    {msg.image && (
                                        <img
                                            src={msg.image}
                                            alt="sent"
                                            style={{
                                                maxWidth: 200,
                                                display: "block",
                                                marginTop: 5,
                                            }}
                                        />
                                    )}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                {selectedUser && (
                    <div className="msg-cont">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={
                                selectedUser
                                    ? "Type a message..."
                                    : publicMode
                                    ? "Send a Public Message"
                                    : "Select a User to Chat"
                            }
                            disabled={!selectedUser && !publicMode}
                            onKeyDown={(e) => handleKeyDown(e)}
                            ref={inputRef}
                            autoComplete="off"
                        />
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp"
                            style={{
                                margin: "1px",
                                padding: "5px",
                                maxWidth: "20px",
                                height: "10px",
                                backgroundColor: "white",
                            }}
                            placeholder="+"
                            onChange={(e) => handleImageSend(e.target.files[0])}
                        />
                        <button
                            className="send"
                            onClick={() => sendMessage(false)}
                            disabled={message.trim() === ""}
                        >
                            Send
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Queries;
