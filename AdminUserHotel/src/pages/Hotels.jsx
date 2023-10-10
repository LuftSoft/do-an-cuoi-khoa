import React, { useEffect, useState } from 'react';
import { GridComponent, Inject, ColumnsDirective, ColumnDirective, Search, Page, Toolbar, Edit, Sort } from '@syncfusion/ej2-react-grids';

import { Button, Modal, Space } from 'antd';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { Header } from '../components';
import { hotelGrid } from '../data/hotels';
import Layout from '../components/Layout';
import { useHotelContext } from '../contexts/HotelProvider';
import ModalAddHotel from '../components/Hotel/ModalAddHotel';
import Loading from '../components/Loading';
import { btnAccept, btnCancel } from '../utils/constant/color';

const Hotel = () => {
  const { hotels, getDataHotels, isLoading, postApprovalHotel } = useHotelContext();
  useEffect(() => {
    getDataHotels();
  }, []);

  const toolbarOptions = ['Search'];
  const editing = { allowDeleting: true, allowEditing: true, allowAdding: true };
  // delete action
  const actionBegin = (args) => {
    if (args.requestType === 'delete') { // triggers while deleting the record
      console.log('actionBegin delete triggers');
      console.log(args.data);
    }
    if (args.requestType === 'save') { // triggers while adding the record
      console.log('actionBegin triggers');
      console.log(args.data);
    }
  };

  const actionComplete = (args) => {
    if (args.requestType === 'save') { // triggers when the record was added
      console.log('actionComplete triggers');
      console.log(args.data);
    }
    if (args.requestType === 'delete') { // triggers when the record was deleted
      console.log('actionComplete triggers');
      console.log(args.data);
    }
  };

  // NOTE: on/off modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  let grid;
  const rowSelected = () => {
    if (grid) {
      const selectedrecords = grid.getSelectedRecords();
      console.log(selectedrecords);
      if (!selectedrecords[0].approval) {
        Swal.fire({
          title: 'Confirm Approval',
          text: 'Are you sure you want to approval this hotel?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: btnAccept,
          cancelButtonColor: btnCancel,
          confirmButtonText: 'Yes',
        }).then(async (result) => {
          if (result.isConfirmed) {
            postApprovalHotel(selectedrecords[0].id);
          }
        });
      } else {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'This hotel has been approved before',
          showConfirmButton: false,
          timer: 2500,
        });
      }
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Layout>
      {isLoading && <Loading isLoading={isLoading} />}
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <Header category="Page" title="Hotels" />

        <GridComponent
          dataSource={hotels}
          width="auto"
          allowPaging
          allowSorting
          pageSettings={{ pageCount: 5, pageSize: 8 }}
          editSettings={editing}
          toolbar={toolbarOptions}
          actionBegin={actionBegin}
          actionComplete={actionComplete}
          rowSelected={rowSelected}
          ref={(g) => grid = g}
        >
          <ColumnsDirective>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            {hotelGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
          </ColumnsDirective>
          <Inject services={[Search]} />

        </GridComponent>
        <Modal title="ADD HOTEL" open={isModalOpen} onCancel={handleCancel} width="70%" cancelButtonProps={{ style: { display: 'none' } }} okButtonProps={{ style: { display: 'none' } }}>
          <ModalAddHotel />
        </Modal>
      </div>
    </Layout>
  );
};
export default Hotel;
