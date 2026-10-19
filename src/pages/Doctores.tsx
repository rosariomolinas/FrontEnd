import CrudPage from '../components/CrudPage';
import Doctor from '../models/Doctor';
import { doctorService } from '../services';

const Doctores = () => <CrudPage plural="Doctores" titulo="Doctor" service={doctorService} Model={Doctor} />;

export default Doctores;
