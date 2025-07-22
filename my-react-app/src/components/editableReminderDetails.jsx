import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditableReminderDetails({ initialReminderDesc, onSaveReminderDesc }) {
  const [isChangingReminder, setChangingReminder] = useState(false);
  const [newReminderDesc, setNewReminderDesc] = useState(initialReminderDesc);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setNewReminderDesc(initialReminderDesc);
  }, [initialReminderDesc]);

  const handleDoubleClick = () => {
    setChangingReminder(true);
  };

  const handleBlur = () => {
    setChangingReminder(false);
    onSaveReminderDesc(newReminderDesc);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setChangingReminder(false);
      onSaveReminderDesc(newReminderDesc);
      navigate(`/notes/${id}`, { state: "Note's reminder has been changed!" });
    }
  };

  const handleChange = (e) => {
    setNewReminderDesc(e.target.value);
  };

  return isChangingReminder ? (
    <input
      type="text"
      style={{ backgroundColor: "rgb(24, 22, 26)", color: "white", borderColor: "transparent" }}
      value={newReminderDesc}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      autoFocus
      className="form-control"
    />
  ) : (
    <p className="text-dark" onDoubleClick={handleDoubleClick}>
      {newReminderDesc}
    </p>
  );
}

export default EditableReminderDetails;
