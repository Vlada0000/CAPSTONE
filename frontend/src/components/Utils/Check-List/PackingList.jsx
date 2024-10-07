import { ListGroup, Button, Form } from 'react-bootstrap';
import { BsTrash, BsPencil } from 'react-icons/bs';

const PackingList = ({ checklist, setChecklist, setShowModal, setEditingIndex, setEditingText }) => {
  const toggleItem = (index) => {
    const updatedChecklist = checklist.map((item, i) => 
      i === index ? { ...item, checked: !item.checked } : item
    );
    setChecklist(updatedChecklist);
  };

  const handleEditItem = (index) => {
    setEditingIndex(index);
    setEditingText(checklist[index].text);
    setShowModal(true);
  };

  const handleDeleteItem = (index) => {
    setChecklist(checklist.filter((_, i) => i !== index));
  };

  return (
    <ListGroup className="mt-3">
      {checklist.map((item, index) => (
        <ListGroup.Item
          key={index}
          className={`d-flex align-items-center ${item.checked ? 'list-group-item-success' : ''}`}
        >
          <Form.Check
            type="checkbox"
            label={item.text}
            checked={item.checked}
            onChange={() => toggleItem(index)}
            className="flex-grow-1"
          />
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => handleEditItem(index)}
            className="me-2"
          >
            <BsPencil />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleDeleteItem(index)}
          >
            <BsTrash />
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default PackingList;
