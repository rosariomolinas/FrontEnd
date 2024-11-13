// Intervenciones.js

import { React, useState } from "react"
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';




const Intervenciones = (props) => {

    
    const [nombpaciente, setNombpaciente] = useState("")  
    const [noteditable, setNotEditable] = useState(true)
 
    const [nombDoctor, setNombDoctor] = useState("")  

    // ventana de búsqueda paciente
    const [vermodal, setVermodal] = useState(false)  
    const [searchcodigo, setSearchCodigo] = useState("")
    const [searchnombre, setSearchNombre] = useState("")  
    const [searchactivo, setSearchActivo] = useState(false)  
    const [searchgrilla, setSearchGrilla] = useState([])  
    const [searchMessage, setSearchMessage] = useState("")

    // ventana de búsqueda doctor
    const [vermodalDoc, setVermodalDoc] = useState(false)  
    const [searchDoccodigo, setSearchDocCodigo] = useState("")
    const [searchDocnombre, setSearchDocNombre] = useState("")  
    const [searchDocactivo, setSearchDocActivo] = useState(false)  
    const [searchDocgrilla, setSearchDocGrilla] = useState([])  
    const [searchDocMessage, setSearchDocMessage] = useState("")
    
    const [listOrganos, setListOrganos] = useState([])
    const [listMedica, setListMedica] = useState([])
    //{"code" : 1, "nombre" : "corazón"}, {"code" : 2, "nombre" : "pulmón"}, {"code" : 3, "nombre" : "higado"}])




      

    //const [intervGrilla, setIntervGrilla] = useState({"organo": "corazon", "tejido" : true, "sangre" : true}, {  "organo": "corazon", "tejido" :false, "sangre" : true})  
    const [intervGrilla, setIntervGrilla] = useState([])  



    // ventana de confirmación
    const [vermodalconf, setVermodalConf] = useState(false)  
 
 // toast
    const [showToast, setShowToast] = useState(false);
    const [textoToast, setTextoToast] = useState("");
    
/* Handle de evento modelo */
async function handleModel(e){
    e.preventDefault()
    try {
       var json = ""
    } catch (error) {
        console.log(error);
        
    }
 }

 /* e.taget.value es la fila de la grilla -- inx es el elemento */ 
 async function  handleOrganoChange(e, inx){
  e.preventDefault()
  try {

    ///setIntervGrilla (intervGrilla => [...intervGrilla, {"organo": 2, "tejido" : false, "sangre" : true}]);


    const fila = inx
    const opt = e.target.value;
    const newintervGrilla = intervGrilla.map((c, i) => {
      if (i === fila) {
       // console.log("fila", i)
        c.organo = opt;
        return c;
      } else {
        // The rest haven't changed
        return c;
      }
    });
    setIntervGrilla(newintervGrilla);



     //console.log("option cambia=>", inx, "--", e.target.value)
  } catch (error) {
      console.log(error);
      
  }
}

async function handleOnChangeChecked(e, inx, campo){
  //e.preventDefault()
  try {
    const fila = inx
    //const opt = e.target.value;
    const newintervGrilla = intervGrilla.map((c, i) => {
      if (i === fila) {
       // console.log("fila", i)
        if (campo == 1) { c.mtejido = !c.mtejido }  
        if (campo == 2) { c.msangre = !c.msangre }  
        if (campo == 3) { c.tomo3d = !c.tomo3d }  
        return c;
      } else {
        // The rest haven't changed
        return c;
      }
    });
    setIntervGrilla(newintervGrilla);
  } catch (error) {
      console.log(error);
      
  }
}
 /* e.taget.value es la fila de la grilla -- inx es el elemento */ 
 async function  handleMedicaChange(e, inx){
  e.preventDefault()
  try {

    ///setIntervGrilla (intervGrilla => [...intervGrilla, {"organo": 2, "tejido" : false, "sangre" : true}]);


    const fila = inx
    const opt = e.target.value;
    const newintervGrilla = intervGrilla.map((c, i) => {
      if (i === fila) {
       // console.log("fila", i)
        c.medica = opt;
        return c;
      } else {
        // The rest haven't changed
        return c;
      }
    });
    setIntervGrilla(newintervGrilla);

  } catch (error) {
      console.log(error);
      
  }
}

 async function handleaddRuta(e){
  e.preventDefault()
  try {
    // la primera vez, cargo los organos
    if (!listOrganos.length)
    {
      console.log("2")
      var jstring;
      var url;
      
      jstring = '{}';
              url = "http://localhost:8080/robiotics/org/traertodos";

          /* fetch de búsqueda */
          var options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            mode: 'cors',
            credential : 'include',
            body:  jstring,
            //JSON.stringify({"code" : 4, "activo" : true}),
            
            };
          
          fetch(url, options)
          .then( response => response.json())
          .then( data => {
              console.log(data.lista)
              if ( data.lista.length)
              {
                setListOrganos(data.lista);
          
              }          
            
          })
        }   
          
     // la primera vez, cargo los medicamentos
     if (!listMedica.length)
      {
        
        var jstring1;
        var url1;
        
        jstring1 = '{}';
                url1 = "http://localhost:8080/robiotics/medica/traertodos";
  
            /* fetch de búsqueda */
            var options1 = {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json'
              },
              mode: 'cors',
              credential : 'include',
              body:  jstring1,
              //JSON.stringify({"code" : 4, "activo" : true}),
              
              };
            
            fetch(url1, options1)
            .then( response => response.json())
            .then( data => {
                console.log(data)
                if ( data.length)
                {
                  setListMedica(data);
            
                }          
              
            })
          }       

    
    setIntervGrilla (intervGrilla => [...intervGrilla, {"organo": 0, "mtejido" : false, "msangre" : false, "tomo3d" : false, "medica" : 0}]);
  } 
     
  catch (error) {
      console.log(error);
      
  }
}



async function handlePresup(e){
  setNombpaciente("");
}

async function handleConfirm(e){
  setNombpaciente("");
}


async function handleEliminar(e, ind){
  const fila = ind
  const opt = e.target.value;
  var i;
  try {
    console.log("grilla filas", intervGrilla.length );
    const newintervGrilla = [];
    for(i=0; i < intervGrilla.length; i++)
    {
      if (i != fila) {
        newintervGrilla.push(intervGrilla[i])
      }

    }
      console.log("grilla nueva", newintervGrilla)
      setIntervGrilla(newintervGrilla);

    } catch (error) {
      console.log(error);
      
    }
}

async function handleNew(e){
  setNombpaciente("");
  setNotEditable(false);
}

/* Abrir ventana de búsqueda */
async function handleSearchShow(e){
  e.preventDefault()
  try {
    setSearchCodigo("");
    setSearchNombre("")  ;
    setSearchActivo(false);
    setSearchGrilla([]);
    
    //handleNew();
    setNotEditable(true)
     setVermodal(true)
  } catch (error) {
      console.log(error);
      
  }
}

/* Cerrar / cancelar ventana de búsqueda */

async function handleSearchClose(e){
  e.preventDefault()
  try {
    setVermodal(false)
  } catch (error) {
      console.log(error);
      
  }
}


/* cuando se hace click sobre alguno de los pacientes de la grilla de búsqueda */

async function handlepacSelected(fila){
  
  try {
    
    

    setNombpaciente(searchgrilla[fila].nombre + ' ' + searchgrilla[fila].apellido);
    
   
    setVermodal(false)
  } catch (error) {
      console.log(error);
      
  }
}

/* Ejecutar la búsqueda en el backend y completar la grilla */
async function handlesearchPac(e){
  var msgactivo;
  var jstring;
  var url;
  e.preventDefault()
  try {
    if (searchactivo)
      { 
       msgactivo = '"activo" : false'
      }
      else {
       msgactivo = '"activo" : true'
      }  
    if (searchcodigo)
      {
        jstring = '{ "code" : "' + searchcodigo +  '", "token" : "' + props.vtoken + '", ' + msgactivo +  '}';
        console.log (jstring);
        url = "http://localhost:8080/robiotics/pac/findcode";
      }
      else
      {
        if (searchnombre)
        {
          jstring = '{ "nombre" : "' + searchnombre + '", '+ msgactivo +  '}';
          url = "http://localhost:8080/robiotics/pac/findname";
    
        }
        else
        {
          jstring = '{'+ msgactivo + '}';
          url = "http://localhost:8080/robiotics/pac/findall";
    
        }
    
      }



/* fetch de búsqueda */
var options = {
  method: 'POST',
  headers: {
  'Content-Type': 'application/json'
  },
  mode: 'cors',
  credential : 'include',
  body:  jstring,
  //JSON.stringify({"code" : 4, "activo" : true}),
  
  };

fetch(url, options)
.then( response => response.json())
.then( data => {
  console.log(data.data)
    setSearchGrilla(data.data);
    if (! data.data.length)
    {
      setSearchMessage("No hay coincidencias");

    }          
  
})


  } catch (error) {
      console.log(error);
      
  }
}


async function    handleOnChangeActivo(e){
  setSearchActivo(!searchactivo); 
  setSearchMessage("");
}

/* Abrir ventana de búsqueda */
async function handleSearchDocShow(e){
  e.preventDefault()
  try {
    setSearchDocCodigo("");
    setSearchDocNombre("")  ;
    setSearchDocActivo(false);
    setSearchDocGrilla([]);
    
    //handleNew();
    setNotEditable(true)
     setVermodalDoc(true)
  } catch (error) {
      console.log(error);
      
  }
}

/* Cerrar / cancelar ventana de búsqueda */

async function handleSearchDocClose(e){
  e.preventDefault()
  try {
    setVermodalDoc(false)
  } catch (error) {
      console.log(error);
      
  }
}


/* cuando se hace click sobre alguno de los doctores de la grilla de búsqueda */

async function handleDocSelected(fila){
  
  try {
    
    

    setNombDoctor(searchDocgrilla[fila].nombre + ' ' + searchDocgrilla[fila].apellido);
    
   
    setVermodalDoc(false)
  } catch (error) {
      console.log(error);
      
  }
}

/* Ejecutar la búsqueda en el backend y completar la grilla */
async function handlesearchDoc(e){
  var msgactivo;
  var jstring;
  var url;
  e.preventDefault()
  try {
    if (searchactivo)
      { 
       msgactivo = '"activo" : false'
      }
      else {
       msgactivo = '"activo" : true'
      }  
    if (searchDoccodigo)
      {
        jstring = '{ "code" : "' + searchDoccodigo +  '", "token" : "' + props.vtoken + '", ' + msgactivo +  '}';
        console.log (jstring);
        url = "http://localhost:8080/robiotics/doctor/findcode";
      }
      else
      {
        if (searchDocnombre)
        {
          jstring = '{ "nombre" : "' + searchDocnombre + '", '+ msgactivo +  '}';
          url = "http://localhost:8080/robiotics/doctor/findname";
    
        }
        else
        {
          jstring = '{'+ msgactivo + '}';
          url = "http://localhost:8080/robiotics/doctor/findall";
    
        }
    
      }



/* fetch de búsqueda */
var options = {
  method: 'POST',
  headers: {
  'Content-Type': 'application/json'
  },
  mode: 'cors',
  credential : 'include',
  body:  jstring,
  //JSON.stringify({"code" : 4, "activo" : true}),
  
  };

fetch(url, options)
.then( response => response.json())
.then( data => {
    setSearchDocGrilla(data.data);
    if (! data.data.length)
    {
      setSearchDocMessage("No hay coincidencias");

    }          
  
})


  } catch (error) {
      console.log(error);
      
  }
}


async function    handleOnChangeDocActivo(e){
  setSearchDocActivo(!searchDocactivo); 
  setSearchDocMessage("");
}



           return (
               <div>
                  
                   <head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="../public/css/stylePac.css"/>
  
  </head>


  <div id="divtabcampos" class="container text-center mb-3">
    <div class="row align-items-start mb-2">
      <div class="col col-2 borde">
          <button type="button" class="btn btn-primary" id="find" onClick={handleSearchShow} disabled={!noteditable} >Buscar Paciente</button>
      </div>
      <div class="col col-2 borde">
        <label for="exampleFormControlInput1" id="nombpaciente" class="form-label">{nombpaciente}</label>
      </div>
    </div>

    <div class="row align-items-start mb-2">
      <div class="col col-2 borde">
        <button type="button" class="btn btn-primary" id="find" onClick={handleSearchDocShow} disabled={!noteditable} >Buscar Médico</button>
      </div>
      <div class="col col-2 borde">
        <label for="exampleFormControlInput1" id="nombdoctor" class="form-label">{nombDoctor}</label>
      </div>
    </div>

    <div class="row align-items-start mb-2 ">
      <div class="col col-2 borde">
         <label for="intervDate">Fecha Intervención:</label>
      </div>
      <div class="col col-2 borde">
      <input id="intervDate" onchange="presupNuevo()" class="form-control" type="date" />
      </div>
    </div>
   
  </div>
  








<div id="divtabruta" class="container text-center mb-3">
  <div class="row align-items-start mb-2 ">
    <div class="col bg-info col-2 borde">
      Órgano
    </div>
    <div class="col bg-info col-1 borde">
      Tejido
    </div>
    <div class="col bg-info col-1 borde">
      Sangre
    </div>
    <div class="col bg-info col-1 borde">
      Tomografía
    </div>
    <div class="col bg-info col-2 borde">
      Medicación
    </div>
    <div class="col bg-info col-2 borde">
      &nbsp;
    </div>
  </div>
  
  {  intervGrilla.map (( unolista, index ) => (
                    <>
                    <div class="row align-items-start borde-primary mb-2" >
                      <div key={index+'_1o'} class="col col-2 border-primary"> 
                          <select name="organos" onChange={(evt) => handleOrganoChange(evt, index)} value= {unolista.organo}>
                              {listOrganos.map((e, key) => {
                                  return <option key={key} value={e.code}>{e.nombre}</option>;
                              })}
                          </select>
                       </div>
                      <div key={index+'_1te'} class="col col-1 border-primary">  <input type="checkbox" class="form-check-input" onChange={(evt) => handleOnChangeChecked(evt, index, 1)} checked={unolista.mtejido} />
                      </div>
                      <div key={index+'_1sa'} class="col col-1 border-primary">  <input type="checkbox" class="form-check-input" onChange={(evt) =>handleOnChangeChecked(evt, index, 2)} checked={unolista.msangre} />
                      </div>
                      <div key={index+'_1to'} class="col col-1 border-primary">  <input type="checkbox" class="form-check-input" onChange={(evt) =>handleOnChangeChecked(evt, index, 3)} checked={unolista.tomo3d} />
                      </div>
                      <div key={index+'_1me'} class="col col-2 border-primary"> 
                          <select name="medicas" onChange={(evt) => handleMedicaChange(evt, index)} value= {unolista.medica}>
                              {listMedica.map((e, key) => {
                                  return <option key={key} value={e.code}>{e.nombre}</option>;
                              })}
                          </select>
                       </div>

                       <div key={index+'_1bo'} class="col col-1 border-primary"> <button type="button" class="btn btn-primary" id="rutaadd" onClick={(evt) => handleEliminar(evt, index)} >Eliminar</button>
                      </div> 
                    </div>
            
                   </>


                  ))} 




</div>

<div id="divtabcampos" class="container text-center mb-3">
    <div class="row align-items-start mb-2">
      <div class="col col-2 borde">
         <button type="button" class="btn btn-primary" id="rutaadd" onClick={handleaddRuta} >Ruta +</button>
      </div>
      <div class="col col-2 borde">
         <button type="button" class="btn btn-primary" id="rutaadd" onClick={handlePresup} >Presupuestar</button>
      </div>
      <div class="col col-2 borde">
         <button type="button" class="btn btn-primary" id="rutaadd" onClick={handleConfirm} >Confirmar</button>
      </div>
    </div>

    <div class="row align-items-start mb-2">
      <div class="col col-2 borde">
        <label for="exampleFormControlInput1" class="form-label">Costo:</label>
      </div>
      <div class="col col-2 borde">
         <label for="exampleFormControlInput1" id="valcosto" class="form-label"></label>
      </div>
    </div>
    <div class="row align-items-start mb-2">
      <div class="col col-2 borde">
      <label for="exampleFormControlInput1" class="form-label">Tiempo:</label>
      </div>
      <div class="col col-2 borde">
      <label for="exampleFormControlInput1" id="valtiempo" class="form-label"></label>
      </div>
    </div>

    <div class="row align-items-start mb-2">
       <div class="col col-2 borde text-danger">
          <label id="err_message"></label>
    </div>
   
  </div>
  


{ /* <!-- Ventana de búsqueda de pacientes //  add show d-block to the class for the modal login to show up-->  */ }

<div class={vermodal ? 'modal fade show d-block' : 'modal fade'} id="pacSearchModal" data-show="true" tabIndex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="false">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="confirmModalLabel">Buscar paciente</h5>
        
      </div>
             <div id="loginModalBody" class="modal-body">
                <div class="form-group">
                    <label for="InputCode">Código :</label>
                    <input type="text" class="form-control" id="inpCode" aria-describedby="emailHelp" onChange={e => {setSearchCodigo(e.target.value); setSearchMessage("")}} value={searchcodigo}  placeholder=""/>
                </div>
                <div class="form-group">
                    <label for="InputNombre">Nombre y Apellido:</label>
                    <input type="text" class="form-control" id="inpNombre" onChange={e => {setSearchNombre(e.target.value); setSearchMessage("")}} value={searchnombre} placeholder=""/>
                </div>
                <div class="form-group">
                  <label for="InputActivo">Incluir inactivos</label>&nbsp;
                  <input type="checkbox" class="form-check-input" id="inpActivo" onChange={handleOnChangeActivo} checked={searchactivo} placeholder=""/>
                </div>
                <div class="form-group text-danger">
                    <label id="log_message">{searchMessage}</label>
                </div>
               </div>
          
              <div class="modal-footer">
                <button type="button" class="btn btn-primary"   onClick={handleSearchClose} data-bs-dismiss="modal">Cancelar</button>
                <button type="button" id="btnconfirm" data-bs-confirm="" onClick={handlesearchPac}  class="btn btn-primary">Buscar</button>
              </div>


            <div id="divtabpac" class="container text-center ml-2 mb-2">
                    <div class="row align-items-start border-primary">
                      <div class="col bg-info col-2 border-primary">
                        Código
                      </div>
                      <div class="col bg-info col-5 border-primary">
                        Nombre
                      </div>
                      <div class="col bg-info col-5 border-primary">
                        Apellido
                      </div>
                    </div>

                  {  searchgrilla.map (( unolista, index ) => (
                    <>
                    <div class="row align-items-start borde-primary" onClick={() => { handlepacSelected(index) }}>
                      <div key={index+'_1p'} class="col col-2 border-primary"> {unolista.code} </div>
                      <div key={index+'_2p'} class="col col-5 border-primary"> {unolista.nombre}</div>
                      <div key={index+'_3p'} class="col col-5 border-primary"> {unolista.apellido}</div>


                    </div>
            
                   </>


                  ))} 
              </div>


    </div>
  </div>
  </div>
  </div>


{ /* <!-- Ventana de búsqueda de doctores //  add show d-block to the class for the modal login to show up-->  */ }

<div class={vermodalDoc ? 'modal fade show d-block' : 'modal fade'} id="docSearchModal" data-show="true" tabIndex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="false">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="confirmModalLabel">Buscar doctor</h5>
        
      </div>
             <div id="loginModalBody" class="modal-body">
                <div class="form-group">
                    <label for="InputCode">Código :</label>
                    <input type="text" class="form-control" id="inpCode" aria-describedby="emailHelp" onChange={e => {setSearchDocCodigo(e.target.value); setSearchDocMessage("")}} value={searchDoccodigo}  placeholder=""/>
                </div>
                <div class="form-group">
                    <label for="InputNombre">Nombre y Apellido:</label>
                    <input type="text" class="form-control" id="inpNombre" onChange={e => {setSearchDocNombre(e.target.value); setSearchDocMessage("")}} value={searchDocnombre} placeholder=""/>
                </div>
                <div class="form-group">
                  <label for="InputActivo">Incluir inactivos</label>&nbsp;
                  <input type="checkbox" class="form-check-input" id="inpActivo" onChange={handleOnChangeDocActivo} checked={searchDocactivo} placeholder=""/>
                </div>
                <div class="form-group text-danger">
                    <label id="log_message">{searchDocMessage}</label>
                </div>
               </div>
          
              <div class="modal-footer">
                <button type="button" class="btn btn-primary"   onClick={handleSearchDocClose} data-bs-dismiss="modal">Cancelar</button>
                <button type="button" id="btnconfirm" data-bs-confirm="" onClick={handlesearchDoc}  class="btn btn-primary">Buscar</button>
              </div>


            <div id="divtabdoc" class="container text-center ml-2 mb-2">
                    <div class="row align-items-start border-primary">
                      <div class="col bg-info col-2 border-primary">
                        Código
                      </div>
                      <div class="col bg-info col-5 border-primary">
                        Nombre
                      </div>
                      <div class="col bg-info col-5 border-primary">
                        Apellido
                      </div>
                    </div>

                  {  searchDocgrilla.map (( unolista, index ) => (
                    <>
                    <div class="row align-items-start borde-primary" onClick={() => { handleDocSelected(index) }}>
                      <div key={index+'_1d'} class="col col-2 border-primary"> {unolista.code} </div>
                      <div key={index+'_2d'} class="col col-5 border-primary"> {unolista.nombre}</div>
                      <div key={index+'_3d'} class="col col-5 border-primary"> {unolista.apellido}</div>


                    </div>
            
                   </>


                  ))} 
              </div>


    </div>
  </div>
  </div>



<ToastContainer position="bottom-end">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          
          <Toast.Body>{textoToast}</Toast.Body>
        </Toast>
        </ToastContainer>




    

               </div>
           );
 }

export default Intervenciones;