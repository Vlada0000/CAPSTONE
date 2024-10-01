import React from 'react';
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
  <>
    <List
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
      current={currentPage}
      pageSize={pageSize}
      total={itineraries.length}
      onChange={onPageChange}
      style={{ textAlign: 'center', marginTop: '20px' }}
    />
  </>
);

export default ItineraryList;
