import { useState, useEffect } from 'react';
import { Form, Button, ProgressBar, InputGroup, FormControl, Modal } from 'react-bootstrap';
import PackingList from './PackingList';
import './TravelCheckList.css';

const packingItems = {
  beach: ['Costume da bagno', 'Asciugamano', 'Protezione solare', 'Occhiali da sole', 'Infradito'],
  mountain: ['Scarponi', 'Giacca a vento', 'Zaino', 'Cappello', 'Guanti'],
  city: ['Mappa', 'Guida turistica', 'Zaino', 'Scarpe comode', 'Ombrello'],
  adventure: ['Tenda', 'Sacco a pelo', 'Torcia', 'Coltello multiuso', 'Acqua'],
};

const TravelChecklist = () => {
  const [tripType, setTripType] = useState('');
  const [checklist, setChecklist] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');

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
    setProgress(Math.round((completed / total) * 100));
  };

  const handleTripTypeChange = (event) => {
    const selectedTripType = event.target.value;
    setTripType(selectedTripType);
    const generatedChecklist = (packingItems[selectedTripType] || []).map((item) => ({
      text: item,
      checked: false,
    }));
    setChecklist(generatedChecklist);
  };

  const handleNewItemChange = (e) => setNewItem(e.target.value);

  const handleAddNewItem = () => {
    if (newItem.trim() === '') return;
    setChecklist([...checklist, { text: newItem, checked: false }]);
    setNewItem('');
  };

  const handleResetChecklist = () => {
    setChecklist([]);
    setTripType('');
    setProgress(0);
    localStorage.removeItem('travelChecklist');
  };

  return (
    <div className="travel-checklist">
      <h3>La tua Checklist di Viaggio</h3>

      <Form.Group controlId="tripType">
        <Form.Label>Seleziona il tipo di viaggio</Form.Label>
        <Form.Control as="select" value={tripType} onChange={handleTripTypeChange}>
          <option value="">Seleziona...</option>
          <option value="beach">Vacanza al mare</option>
          <option value="mountain">Montagna</option>
          <option value="city">Visita città</option>
          <option value="adventure">Avventura</option>
        </Form.Control>
      </Form.Group>

      {checklist.length > 0 && (
        <>
          <div className="progress-section">
            <h4>Progresso: {progress}%</h4>
            <ProgressBar now={progress} label={`${progress}%`} />
          </div>

          <PackingList 
            checklist={checklist} 
            setChecklist={setChecklist} 
            setShowModal={setShowModal} 
            setEditingIndex={setEditingIndex} 
            setEditingText={setEditingText} 
          />

          <InputGroup className="mt-3">
            <FormControl
              placeholder="Aggiungi un nuovo elemento"
              value={newItem}
              onChange={handleNewItemChange}
            />
            <Button variant="primary" onClick={handleAddNewItem}>
              Aggiungi
            </Button>
          </InputGroup>

          <div className="mt-3 d-flex justify-content-between">
            <Button variant="success" onClick={() => localStorage.setItem('travelChecklist', JSON.stringify(checklist))}>
              Salva Checklist
            </Button>
            <Button variant="danger" onClick={handleResetChecklist}>
              Resetta Checklist
            </Button>
          </div>
        </>
      )}

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
          <Button variant="primary" onClick={() => {
            const updatedChecklist = checklist.map((item, index) => 
              index === editingIndex ? { ...item, text: editingText } : item
            );
            setChecklist(updatedChecklist);
            setEditingIndex(null);
            setEditingText('');
            setShowModal(false);
          }}>
            Salva
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TravelChecklist;
