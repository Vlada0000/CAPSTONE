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
    <List className='mt-3'
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
    <Pagination className='mb-3'
      current={currentPage}
      pageSize={pageSize}
      total={itineraries.length}
      onChange={onPageChange}
      style={{  marginTop: '20px', display: 'flex', justifyContent:'center' }}
    />
  </>
);

export default ItineraryList;
