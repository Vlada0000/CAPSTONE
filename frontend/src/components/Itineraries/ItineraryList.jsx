import { List, Pagination } from 'antd';
import ItineraryItem from './ItineraryItem';


const ItineraryList = ({
  itineraries,
  currentPage,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
}) => (
  <div className="itinerary-list-container">
    <List
      className="itinerary-list mt-3"
      bordered
      dataSource={itineraries}
      renderItem={(itinerary) => (
        <ItineraryItem
          itinerary={itinerary}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    />
    <Pagination
      className="itinerary-pagination mb-3 mt-2 d-flex justify-content-center"
      current={currentPage}
      pageSize={pageSize}
      total={itineraries.length}
      onChange={onPageChange}
    />
  </div>
);

export default ItineraryList;
