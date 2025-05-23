import axios from "axios"

const API = axios.create({baseURL:'https://rental-vehicle-app-hfvqh.ondigitalocean.app/',withCredentials:true})
export const login =(data)=> API.post("/api/login",data)
export const fetchProfileInfo = ()=>API.get('/api/view/profile_info')
export const getAllUsers = ()=>API.get('/api/get/all_users')
export const addTenantRecord =(data)=>API.post("/api/create_rent/record",data)
export const fetchTenantsRecords = ()=>API.get("/api/view/rent_records")
export const fetchTenantRecord = (Id)=>API.get(`/api/view/rent_record/${Id}`)
export const editTenant = (Id,data)=>API.put(`/api/edit/rent_record/${Id}`,data)
export const deleteTenantRecord = (Id) => API.delete(`/api/delete/rent_record/${Id}`)
export const addApartmentProperty = (data)=>API.post('/api/add/apartment_property',data)
export const getApartmentProperties =()=>API.get('/api/get/apartment_properties')
export const updateApartment =(Id,data)=>API.put(`/api/edit/apartment_property/${Id}`,data)
export const getSingleApartment =(Id)=>API.get(`/api/get/apartment_property/${Id}`)
export const deleteApartment =(Id)=>API.delete(`/api/delete/apartment_property/${Id}`)
export const addNewUser =(data)=>API.post('/api/add/new_user',data)
export const updateUser = (data)=>API.put('/api/modify/user/',data)
export const removeUser =(Id)=>API.delete(`/api/delete/user/${Id}`)
export const logout =()=>API.post('/api/logout')

// Payments
export const addPayment = (data)=>API.post('/api/apartment/add_payment',data)
export const editPayment = (Id,data)=>API.put(`/api/apartment/edit_payment/${Id}`,data)
export const deletePayment = (Id)=>API.delete(`/api/apartment/delete_payment/${Id}`)
export const getAllPayments = ()=>API.get('/api/apartment/all_payments')
export const getPayment =(Id)=>API.get(`/api/apartment/get_payment/${Id}`)

// Vehicles
export const getVehicles =()=>API.get('/api/get/vehicle_records')
export const addVehicleRecord =(data)=>API.post('/api/add/vehicle_record',data)
export const getSingleVehicle = (Id)=>API.get(`/api/get/vehicle_record/${Id}`)
export const updateVehicle =(Id,data)=>API.put(`/api/edit/vehicle_record/${Id}`,data)
export const deleteVehicleRecord  =(Id)=>API.delete(`/api/delete/vehicle_record/${Id}`)
export const addMaintenanceRecord =(data)=>API.post('/api/add/maintenance_record',data)
export const getMaintenanceRecords =()=>API.get('/api/get/maintenance_records')
export const getSingleMaintenanceRecord = (Id) =>API.get(`/api/get/vehicle_maintenance_record/${Id}`)
export const deleteMaintenanceRecord =(Id)=>API.delete(`/api/delete/maintenance_record/${Id}`)
export const updateMaintenanceRecord = (Id,data)=>API.put(`/api/edit/vehicle_maintenance/${Id}`,data)

 