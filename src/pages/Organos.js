import CrudPage from '../components/CrudPage';
import Organo from '../models/Organo';
import { organoService } from '../services';

const Organos = () => <CrudPage plural="Órganos" titulo="Órgano" service={organoService} Model={Organo} />;

export default Organos;
