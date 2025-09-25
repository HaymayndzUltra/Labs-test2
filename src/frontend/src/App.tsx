import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import SaaSModule from "./modules/SaaSModule";
import EcommerceModule from "./modules/EcommerceModule";
import AnalyticsModule from "./modules/AnalyticsModule";
import CustomAppModule from "./modules/CustomAppModule";
import MediaModule from "./modules/MediaModule";
import EdtechModule from "./modules/EdtechModule";
import RealEstateModule from "./modules/RealEstateModule";
import FinanceModule from "./modules/FinanceModule";
import HealthcareModule from "./modules/HealthcareModule";

const App: React.FC = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/saas" replace />} />
        <Route path="/saas" element={<SaaSModule />} />
        <Route path="/ecommerce" element={<EcommerceModule />} />
        <Route path="/analytics" element={<AnalyticsModule />} />
        <Route path="/custom-app" element={<CustomAppModule />} />
        <Route path="/media" element={<MediaModule />} />
        <Route path="/edtech" element={<EdtechModule />} />
        <Route path="/real-estate" element={<RealEstateModule />} />
        <Route path="/finance" element={<FinanceModule />} />
        <Route path="/healthcare" element={<HealthcareModule />} />
      </Routes>
    </AppLayout>
  );
};

export default App;
