import React, { useState } from 'react';
import './ModalAddHotel.css';
import { Button, Divider, Select, Switch } from 'antd';
import useGetAddress from '../../hooks/useGetAddress';
import { getCategoryUrl, getDistrictUrl, getHomeletUrl, getProvineUrl } from '../../utils/constant/pointApi';
import useGetCategory from '../../hooks/useGetCategory';
import { useHotelContext } from '../../contexts/HotelProvider';

const ModalAddHotel = () => {
  const { postNewHotel } = useHotelContext();
  const [hotel, setHotel] = useState({
    Name: '',
    Star: '',
    Description: '',
    Address: '',
    Slug: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setHotel({ ...hotel, [name]: value });
  };

  const [provine, setProvine] = useState(null);
  const [district, setDistrict] = useState(null);
  const [homeLet, setHomeLet] = useState(null);
  const [category, setCategory] = useState(null);

  const { loading: loadingProvine, data: provines } = useGetAddress(getProvineUrl);
  const { loading: loadingDistrict, data: districts } = useGetAddress(`${getDistrictUrl}/${provine}`, provine);
  const { loading: loadingHomeLet, data: homeLets } = useGetAddress(`${getHomeletUrl}/${district}`, district);
  const { loading: loadingCategory, data: categories } = useGetCategory(getCategoryUrl);

  const [restaurant, setRestaurant] = useState(false);
  const [AllTimeFrontDesk, setAllTimeFrontDesk] = useState(false);
  const [Elevator, setElevator] = useState(false);
  const [Pool, setPool] = useState(false);
  const [FreeBreakfast, setFreeBreakfast] = useState(false);
  const [AirConditioner, setAirConditioner] = useState(false);
  const [CarBorow, setCarBorow] = useState(false);
  const [WifiFree, setWifiFree] = useState(false);
  const [Parking, setParking] = useState(false);
  const [AllowPet, setAllowPet] = useState(false);
  // switch

  const onChange = (checked, mode) => {
    switch (mode) {
      case 'restaurant':
        setRestaurant(checked);
        break;
      case 'elevator':
        setElevator(checked);
        break;
      case 'pool':
        setPool(checked);
        break;
      case 'breakfast':
        setFreeBreakfast(checked);
        break;
      case 'WiFi':
        setWifiFree(checked);
        break;
      case 'parking':
        setParking(checked);
        break;
      case 'pets':
        setAllowPet(checked);
        break;
      case 'air':
        setAirConditioner(checked);
        break;
      case 'receptionist':
        setAllTimeFrontDesk(checked);
        break;
      case 'Car':
        setCarBorow(checked);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // const dataFrom = new FormData();
    // dataFrom.append("Id",Math.floor(Math.random() * 10000) + 1);
    // dataFrom.append("Name",hotel.Name);
    // dataFrom.append("Star",hotel.Star);
    // dataFrom.append("Description",hotel.Description);
    // dataFrom.append("Address",);
    // dataFrom.append("Slug",);
    // dataFrom.append("USerId",);
    // dataFrom.append("HotelCategoryId",);
    // dataFrom.append("Resttaurant",);
    // dataFrom.append("AllTimeFrontDesk",);
    // dataFrom.append("Elevator",);
    // dataFrom.append("Pool",);
    // dataFrom.append("FreeBreakfast",);
    // dataFrom.append("AirConditioner",);
    // dataFrom.append("CarBorow",);
    // dataFrom.append("WifiFree",);
    // dataFrom.append("Parking",);
    // dataFrom.append("AllowPet",);
    postNewHotel({
      Id: '0',
      Name: hotel.Name,
      Star: Number.parseInt(hotel.Star, 10),
      Description: hotel.Description,
      Address: hotel.Address,
      Slug: hotel.Slug,
      USerId: '',
      HotelCategoryId: category,
      HotelBenefitId: 0,
      HomeletId: homeLet,
      Resttaurant: restaurant,
      AllTimeFrontDesk,
      Elevator,
      Pool,
      FreeBreakfast,
      AirConditioner,
      CarBorow,
      WifiFree,
      Parking,
      AllowPet,
    });
  };
  return (
    <div className="container1">
      <form onSubmit={handleSubmit} encType="multipart/form-data" method="POST">
        <Divider orientation="left" plain>
          Basic information
        </Divider>
        <div className="flex">
          <div className="inputContainer w-8/12">
            <input name="Name" value={hotel.Name} placeholder="Hotel name" onChange={handleInputChange} />
          </div>
          <div className="inputContainer w-4/12">
            <input name="Star" value={hotel.Star} placeholder="Hotel Star" onChange={handleInputChange} />
          </div>
        </div>
        <div className="flex">
          <div className="inputContainer w-8/12">
            <input name="Slug" value={hotel.Slug} placeholder="Slug" onChange={handleInputChange} />
          </div>
          <div className="inputContainer w-4/12">
            <Select
              loading={loadingCategory}
              options={categories}
              showSearch
              style={{ width: '100%' }}
              placeholder="Search category"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
              onChange={(value) => setCategory(value)}
            />
          </div>
        </div>
        <div className="inputContainer">
          <input name="Description" value={hotel.Description} placeholder="Description" onChange={handleInputChange} />
        </div>
        <Divider orientation="left" plain>
          Address detail
        </Divider>
        <div className="flex flex-row">
          <div className="inputContainer w-4/12">
            <Select
              loading={loadingProvine}
              options={provines}
              showSearch
              style={{ width: '100%' }}
              placeholder="Search provine"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
              onChange={(value) => setProvine(value)}
            />
          </div>
          {provine && (
            <div className="inputContainer w-4/12">
              <Select
                loading={loadingDistrict}
                options={districts}
                showSearch
                style={{ width: '100%' }}
                placeholder="Search district"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                onChange={(value) => setDistrict(value)}
              />
            </div>
          )}
          {district && (
            <div className="inputContainer w-4/12">
              <Select
                loading={loadingHomeLet}
                options={homeLets}
                showSearch
                style={{ width: '100%' }}
                placeholder="Search homelet"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                onChange={(value) => setHomeLet(value)}
              />
            </div>
          )}
        </div>
        <div className="inputContainer w-12/12">
          <input name="Address" value={hotel.Address} placeholder="Address" onChange={handleInputChange} />
        </div>
        <Divider orientation="left" plain>
          The accompanying services
        </Divider>
        <div className="mt-6 flex flex-wrap ml-4">
          <div className="flex w-6/12 mb-2">
            <Switch checked={restaurant} onChange={(value) => onChange(value, 'restaurant')} />
            <p className="addtional ml-4">The hotel has a restaurant</p>
          </div>
          <div className="flex w-6/12 mb-2">
            <Switch checked={Elevator} onChange={(value) => onChange(value, 'elevator')} />
            <p className="addtional ml-4">The hotel has an elevator</p>
          </div>
          <div className="flex w-6/12 mb-2">
            <Switch checked={Pool} onChange={(value) => onChange(value, 'pool')} />
            <p className="addtional ml-4">The hotel has a swimming pool</p>
          </div>
          <div className="flex w-6/12 mb-2">
            <Switch checked={FreeBreakfast} onChange={(value) => onChange(value, 'breakfast')} />
            <p className="addtional ml-4">Complimentary breakfast</p>
          </div>
          <div className="flex w-6/12 mb-2">
            <Switch checked={WifiFree} onChange={(value) => onChange(value, 'WiFi')} />
            <p className="addtional ml-4">The hotel offers free WiFi</p>
          </div>
          <div className="flex w-6/12 mb-2">
            <Switch checked={Parking} onChange={(value) => onChange(value, 'parking')} />
            <p className="addtional ml-4">There is a parking lot</p>
          </div>
          <div className="flex w-6/12 mb-2">
            <Switch checked={AllowPet} onChange={(value) => onChange(value, 'pets')} />
            <p className="addtional ml-4">Pets are allowed</p>
          </div>
          <div className="flex w-6/12 mb-2">
            <Switch checked={AirConditioner} onChange={(value) => onChange(value, 'air')} />
            <p className="addtional ml-4">The room has air conditioning</p>
          </div>
          <div className="flex w-6/12 mb-2">
            <Switch checked={AllTimeFrontDesk} onChange={(value) => onChange(value, 'receptionist')} />
            <p className="addtional ml-4">The receptionist is available 24/7</p>
          </div>
          <div className="flex w-6/12 mb-2">
            <Switch checked={CarBorow} onChange={(value) => onChange(value, 'Car')} />
            <p className="addtional ml-4">Car Borow</p>
          </div>
        </div>
        <div className="flex justify-center mt-3">
          <Button type="primary" className="bg-sky-500" htmlType="submit">Add Hotel</Button>
        </div>
      </form>
    </div>
  );
};

export default ModalAddHotel;
