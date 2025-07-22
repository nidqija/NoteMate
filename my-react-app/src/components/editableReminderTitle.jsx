import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditableReminderTitle({ initialReminderTitle, onSaveReminder }) {
  const [isChangingReminder, setChangingReminder] = useState(false);
  const [newReminder, setNewReminder] = useState(initialReminderTitle);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDoubleClick = () => {
    setChangingReminder(true);
  };

  const handleBlur = () => {
    setChangingReminder(false);
    onSaveReminder(newReminder);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setChangingReminder(false);
      onSaveReminder(newReminder);
      navigate(`/notes/${id}`, { state: "Note's reminder has been changed!" });
    }
  };

  const handleChange = (e) => {
    setNewReminder(e.target.value);
  };

  return isChangingReminder ? (
    <input
      type="text"
      style={{ backgroundColor: "rgb(24, 22, 26)", color: "white", borderColor: "transparent" }}
      value={newReminder}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      autoFocus
      className="form-control"
    />
  ) : (
    <p className="text-dark" onDoubleClick={handleDoubleClick}>
      {newReminder}
    </p>
  );
}

export default EditableReminderTitle;
