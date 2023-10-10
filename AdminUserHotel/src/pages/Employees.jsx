import React, { useEffect } from 'react';
import { GridComponent, Inject, ColumnsDirective, ColumnDirective, Search, Page, Toolbar, Edit, Sort } from '@syncfusion/ej2-react-grids';
import Swal from 'sweetalert2';
import { Header } from '../components';
import { userGrid } from '../data/users';
import Layout from '../components/Layout';
import { useUserContext } from '../contexts/UserProvider';
import Loading from '../components/Loading';
import { btnAccept, btnCancel } from '../utils/constant/color';

const Employees = () => {
  const toolbarOptions = ['Search', 'Cancel'];

  const editing = { allowDeleting: true, allowEditing: true, allowAdding: true };
  const { getDataUsers, users, lockUser, unlockUser, isLoading } = useUserContext();
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

  let grid;
  const rowSelected = () => {
    if (grid) {
      const selectedrecords = grid.getSelectedRecords();
      console.log(selectedrecords);
      if (!selectedrecords[0].isBlock) {
        Swal.fire({
          title: 'Confirm block',
          text: 'Are you sure you want to block this person?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: btnAccept,
          cancelButtonColor: btnCancel,
          confirmButtonText: 'Yes',
        }).then(async (result) => {
          if (result.isConfirmed) {
            lockUser(selectedrecords[0].id);
          }
        });
      } else {
        Swal.fire({
          title: 'Confirm unlock',
          text: 'Are you sure you want to unlock this person?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: btnAccept,
          cancelButtonColor: btnCancel,
          confirmButtonText: 'Yes',
        }).then((result) => {
          if (result.isConfirmed) {
            unlockUser(selectedrecords[0].id);
          }
        });
      }
    }
  };

  useEffect(() => {
    getDataUsers();
  }, []);
  return (
    <Layout>
      {isLoading && <Loading isLoading={isLoading} />}
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <Header category="Page" title="Users" />
        <GridComponent
          dataSource={users}
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
            {userGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
          </ColumnsDirective>
          <Inject services={[Search, Page, Toolbar, Edit, Sort]} />

        </GridComponent>
      </div>
    </Layout>
  );
};
export default Employees;
