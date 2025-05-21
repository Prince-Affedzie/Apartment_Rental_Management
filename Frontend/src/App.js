import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import AppointmentDashboard from "./Pages/AppartmentsDashboard";
import TenantsPage from "./Pages/TenantsPage";
import ApartmentsListPage from "./Pages/ApartmentsListPage";
import AddTenantPage from "./Pages/AddTenantPage";
import EditTenantPage from "./Pages/EditTenantPage";
import AddPropertyPage from "./Pages/AddApartmentPropertyPage";
import EditApartmentPage from "./Pages/EditApartmentPage";
import PaymentsListPage from "./Pages/RentsPaymentPage";
import AddPaymentPage from "./Pages/AddPaymentPage";
import EditPaymentPage from "./Pages/EditPaymentPage";
import VehicleDashboard from "./Pages/VehicleManagementDashboard";
import AddVehiclePage from "./Pages/AddVehicleRecordPage";
import VehicleListPage from "./Pages/ListofVehiclesPage";
import EditVehiclePage from "./Pages/EditVehiclePage";
import AddMaintenancePage from "./Pages/CarMaintenanceForms";
import MaintenanceListPage from "./Pages/CarMaintenanceList";
import EditMaintenancePage from "./Pages/EditCarMaintenance";
import SettingsPage from "./Pages/SettingsPage";
import ProtectedRoute from "./Utils/ProtectedRoute";
//import CarRentalDashboard from "./layouts/CarRentalDashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage/></ProtectedRoute>}/>

        {/* Apartment Dashboard Routes */}
       <Route path="/apartments/dashboard" element={< AppointmentDashboard />} />
       <Route path="/apartments/tenants" element={<TenantsPage/>}/>
       <Route path="/apartments/list" element={<ApartmentsListPage/>}/>
       <Route path="/apartments/add_tenant_record" element={<AddTenantPage/>}/>
       <Route path="/apartments/tenant/edit/:Id" element={<EditTenantPage/>}/>
       <Route path="/apartments/add_property" element={<AddPropertyPage/>}/>
       <Route path="/apartment/edit/:Id" element={<EditApartmentPage/>}/>
       <Route path="/apartments/payment/list" element={<PaymentsListPage/>}/>
       <Route path="/apartmnet/add_payment" element={<AddPaymentPage/>}/>
       <Route path="/apartment/edit_payment/:Id" element={<EditPaymentPage/>}/>

       <Route path="/vehicles/dashboard" element={<VehicleDashboard/>}/>
       <Route path="/vehicle/add_record" element={<AddVehiclePage/>}/>
       <Route path="/vehicles/list" element={<VehicleListPage/>}/>
       <Route path="/vehicle/edit_record/:Id" element={<EditVehiclePage/>}/>
       <Route path="/vehicle/add_maintenance" element={<AddMaintenancePage/>}/>
       <Route path='/vehicle/maintainance_list' element={<MaintenanceListPage/>}/>
       <Route path='/vehicle/edit_maintenance_record/:Id' element={<EditMaintenancePage/>}/>

        {/* Car Rental Dashboard Routes */}
       {/* <Route path="/cars/*" element={<CarRentalDashboard />} /> */}
      </Routes>
    </Router>
  );
}