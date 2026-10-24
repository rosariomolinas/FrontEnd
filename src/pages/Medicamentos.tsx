import CrudPage from '../components/CrudPage';
import Medicamento from '../models/Medicamento';
import { medicamentoService } from '../services';

const Medicamentos = () => (
  <CrudPage plural="Medicamentos" titulo="Medicamento" service={medicamentoService} Model={Medicamento} />
);

export default Medicamentos;
