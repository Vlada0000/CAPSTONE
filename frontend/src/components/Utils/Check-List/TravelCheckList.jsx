import React, { useState, useEffect } from 'react';
import {
  Form,
  Button,
  InputGroup,
  FormControl,
  Modal,
  ProgressBar,
  ListGroup,
} from 'react-bootstrap';
import { BsTrash, BsPencil } from 'react-icons/bs';

import './TravelCheckList.css';


const packingItems = {
  beach: [
    'Costume da bagno',
    'Asciugamano',
    'Protezione solare',
    'Occhiali da sole',
    'Infradito',
  ],
  mountain: ['Scarponi', 'Giacca a vento', 'Zaino', 'Cappello', 'Guanti'],
  city: ['Mappa', 'Guida turistica', 'Zaino', 'Scarpe comode', 'Ombrello'],
  adventure: ['Tenda', 'Sacco a pelo', 'Torcia', 'Coltello multiuso', 'Acqua'],
};

const TravelChecklist = () => {
  const [tripType, setTripType] = useState('');
  const [checklist, setChecklist] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [progress, setProgress] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedChecklist = localStorage.getItem('travelChecklist');
    if (savedChecklist) {
      const parsedChecklist = JSON.parse(savedChecklist);
      setChecklist(parsedChecklist);
      calculateProgress(parsedChecklist);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('travelChecklist', JSON.stringify(checklist));
    calculateProgress(checklist);
  }, [checklist]);

  const calculateProgress = (list) => {
    if (list.length === 0) {
      setProgress(0);
      return;
    }
    const completed = list.filter((item) => item.checked).length;
    const total = list.length;
    const percentage = Math.round((completed / total) * 100);
    setProgress(percentage);
  };

  const handleTripTypeChange = (event) => {
    const selectedTripType = event.target.value;
    setTripType(selectedTripType);
    const generatedChecklist = (packingItems[selectedTripType] || []).map(
      (item) => ({
        text: item,
        checked: false,
      })
    );
    setChecklist(generatedChecklist);
  };

  const toggleItem = (index) => {
    const updatedChecklist = checklist.map((item, i) => {
      if (i === index) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    setChecklist(updatedChecklist);
  };

  const handleAddNewItem = () => {
    if (newItem.trim() === '') return;
    const updatedChecklist = [
      ...checklist,
      { text: newItem, checked: false },
    ];
    setChecklist(updatedChecklist);
    setNewItem('');
  };

  const handleDeleteItem = (index) => {
    const updatedChecklist = checklist.filter((_, i) => i !== index);
    setChecklist(updatedChecklist);
  };

  const handleEditItem = (index) => {
    setEditingIndex(index);
    setEditingText(checklist[index].text);
    setShowModal(true);
  };

  const handleSaveEdit = () => {
    const updatedChecklist = checklist.map((item, index) => {
      if (index === editingIndex) {
        return { ...item, text: editingText };
      }
      return item;
    });
    setChecklist(updatedChecklist);
    setEditingIndex(null);
    setEditingText('');
    setShowModal(false);
  };

  const handleResetChecklist = () => {
    setChecklist([]);
    setTripType('');
    setProgress(0);
    localStorage.removeItem('travelChecklist');
  };

  
  const handleSubmit = () => {
    console.log('Checklist completata:', checklist);
   
    localStorage.setItem('travelChecklist', JSON.stringify(checklist));
  };

  return (
    <div className="travel-checklist">
      <h3>La tua Checklist di Viaggio</h3>

      <Form.Group controlId="tripType">
        <Form.Label>Seleziona il tipo di viaggio</Form.Label>
        <Form.Control
          as="select"
          value={tripType}
          onChange={handleTripTypeChange}
        >
          <option value="">Seleziona...</option>
          <option value="beach">Vacanza al mare</option>
          <option value="mountain">Montagna</option>
          <option value="city">Visita città</option>
          <option value="adventure">Avventura</option>
        </Form.Control>
      </Form.Group>

      {checklist.length > 0 && (
        <div>
          <div className="progress-section">
            <h4>Progresso: {progress}%</h4>
            <ProgressBar now={progress} label={`${progress}%`} />
          </div>

          <ListGroup className="mt-3">
            {checklist.map((item, index) => (
              <ListGroup.Item
                key={index}
                className={`d-flex align-items-center ${
                  item.checked ? 'list-group-item-success' : ''
                }`}
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

          <InputGroup className="mt-3">
            <FormControl
              placeholder="Aggiungi un nuovo elemento"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />
            <Button variant="primary" onClick={handleAddNewItem}>
              Aggiungi
            </Button>
          </InputGroup>

          <div className="mt-3 d-flex justify-content-between">
            <Button variant="success" onClick={handleSubmit}>
              Salva Checklist
            </Button>
            <Button variant="danger" onClick={handleResetChecklist}>
              Resetta Checklist
            </Button>
          </div>
        </div>
      )}

      {/* Modal per modificare un elemento */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Elemento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annulla
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Salva
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TravelChecklist;
