
import { useContext, useEffect } from "react";
import { NotificationContext } from "../Context/NotificationContext";
import { useDispatch, useSelector } from "react-redux";
import { clear } from "../Slices/ClientNotify";
import { useNavigate } from "react-router-dom";

const NotificationDisplay = () => {
  const { msg, from, setMsg, setFrom } = useContext(NotificationContext);
  const role = sessionStorage.getItem('role')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (msg) {
        const timer = setTimeout(() => {
            setMsg(null);
            setFrom(null);
        }, 3000);
        return () => clearTimeout(timer);
    }
  }, [msg, from, setFrom, setMsg]);

  if (!msg) return null;

  const handleUnread = () => {
    if(role === 'User'){
      dispatch(clear())
      navigate('/queries')
    }
  }

  return (
    <div className="notification" onClick={handleUnread}>
        <span className="notify-from">{from}</span>
        <span className="notify-msg">{msg}</span>
    </div>
  );
};

export default NotificationDisplay;
