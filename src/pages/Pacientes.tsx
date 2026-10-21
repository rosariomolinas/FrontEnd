import CrudPage from '../components/CrudPage';
import Paciente from '../models/Paciente';
import { pacienteService } from '../services';

const Pacientes = () => <CrudPage plural="Pacientes" titulo="Paciente" service={pacienteService} Model={Paciente} />;

export default Pacientes;
