import '../App.css';
import { Component, useEffect } from 'react';
import { FaDeleteLeft } from "react-icons/fa6";
import { useNavigate, Link } from 'react-router-dom';
import { GiCardboardBoxClosed } from "react-icons/gi";

const YourFunctionalComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Access the parameters from the URL using window.location.search
    const queryParams = new URLSearchParams(window.location.search);
    const selectedSku = queryParams.get('sku');
  }, []);

  return <Sku navigate={navigate} />;
};

class Sku extends Component{

constructor(props){
  super(props);
  this.state={
    buildlist:[],
    maintenancelist:[],
    warrantylist:[]
  }
}

API_URL="http://localhost:5204/";

componentDidMount(){
  this.refreshBuildList();
  this.refreshMaintenanceList();
  this.refreshWarrantyList();
}

async refreshBuildList(){
  fetch(this.API_URL+"api/buildlist/GetBuildList").then(response=>response.json())
  .then(data=>{
    this.setState({buildlist:data});
  })
}

async refreshMaintenanceList(){
  fetch(this.API_URL+"api/buildlist/GetMaintenanceList").then(response=>response.json())
  .then(data=>{
    this.setState({maintenancelist:data});
  })
}
async refreshWarrantyList(){
  fetch(this.API_URL+"api/buildlist/GetWarrantyList").then(response=>response.json())
  .then(data=>{
    this.setState({warrantylist:data});
  })
}

render() {
  const{buildlist}=this.state;
  const{maintenancelist}=this.state;
  const{warrantylist}=this.state;
  // Access the navigate function from props
  const { navigate } = this.props;

  // Use the navigate function to access URL parameters
  const queryParams = new URLSearchParams(window.location.search); 

  const selectedSku = queryParams.get('sku');
  const selectedEntry = buildlist.find(entry => entry.sku === selectedSku);
  const maintenanceEntry = maintenancelist.filter(entry => entry.sku === selectedSku);
  const warrantyEntry = warrantylist.filter(entry => entry.sku === selectedSku);
  
  // console.log("Maintenance entry:", maintenanceEntry)
  // Logs entries to console
  // maintenancelist.forEach((entry, index) => {
  //   console.log(`Entry ${index + 1}:`, entry);
  // });
  return (
    <div>
    {selectedEntry ? (
    <>
      <h2 class="flex justify-center text-4xl">{selectedSku} / {selectedEntry.make} / {selectedEntry.model} / {selectedEntry.color} / {selectedEntry.size}</h2>
      <div class="flex justify-center"><button class="rounded-md bg-slate-600 p-2 m-2 text-white"><Link to="/">Go Back</Link></button></div>
      {/* General Info */}
      <div class="grid grid-cols-4 justify-center gap-4 my-3">
        <div>{selectedEntry.quantity}</div>
        <div>{selectedEntry.priority}</div>
        <div>{selectedEntry.quantityNeeded}</div>
        <div>
          <GiCardboardBoxClosed />
          <input id="newSku" onKeyDown={(e) => {if (e.key === "Enter") {this.addClick()}}} class="placeholder:text-black block bg-white border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" value={selectedEntry.inBoxQuantity} type="text"/>
          {selectedEntry.inBoxQuantity}inBoxQuantity
          </div>
      </div>
      <button class="rounded-md bg-slate-600 p-2 m-2 text-white"><Link to="/">Create Warranty</Link></button>
      <button class="rounded-md bg-slate-600 p-2 m-2 text-white"><Link to="/">Create Maintenance</Link></button>
      <div class="grid grid-cols-2 justify-center gap-4 my-3">
        <div>
        {maintenanceEntry.map(entry=>
          <div class="flex justify-center">
            <div class="grid grid-cols-4 justify-center gap-4 my-3">
              <div>
                <p>Maintenance ID: {entry.id}</p>
                <p>Serial Number</p>
                <input id="serial" class="placeholder:italic placeholder:text-slate-400 block bg-white border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Enter Serial" type="text"/>
                <button class="rounded-md bg-slate-600 p-2 m-2 text-white">Archive Entry</button>
              </div>
              <div>
                <h2>Description</h2>
                <textarea id="message" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Type information here..."></textarea>  
              </div>
            </div>
          </div>
        )}
        </div>
        <div>
        {warrantyEntry.map(entry=>
        <div class="flex justify-center">
          <div class="grid grid-cols-4 justify-center gap-4 my-3">
            <div>
              <p>Warranty ID: {entry.id}</p>
              <p>Serial Number</p>
              <input id="serial" class="placeholder:italic placeholder:text-slate-400 block bg-white border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Enter Serial" type="text"/>
              <p>Claim Number</p>
              <input id="serial" class="placeholder:italic placeholder:text-slate-400 block bg-white border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Enter Serial" type="text"/>
              <div class="flex items-center mb-4">
                  <input id="default-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                  <label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Warranty filed?</label>
              </div>
              <button class="rounded-md bg-slate-600 p-2 m-2 text-white">Archive Entry</button>
            </div>
            <div>
              <h2>Description</h2>
              <textarea id="message" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Type information here..."></textarea>  
            </div>
          </div>
        </div>
        )}
        </div>
      </div>
      {/* Maintenance Info 
      <div class="grid grid-cols-2 justify-center gap-4 my-3 font-bold">
        <div>Maintenance Information</div>
      </div>
      <div class="grid grid-cols-2 justify-center gap-4 my-3 font-bold">
        <div>maintenanceQuantity</div>
        <div>maintenanceDesc</div>
      </div>
      <div class="grid grid-cols-2 justify-center gap-4 my-3">
        <div>{selectedEntry.maintenanceQuantity}maintenanceQuantity</div>
        <div>{selectedEntry.maintenanceDesc}maintenanceDesc</div>
      </div>*/}
      {/* Defective Info 
      <div class="grid grid-cols-5 justify-center gap-4 my-3 font-bold">
        <div>Defective Information</div>
      </div>
      <div class="grid grid-cols-5 justify-center gap-4 my-3 font-bold">
        <div>defectiveQuantity</div>
        <div>defectiveDesc</div>
        <div>defectiveSerial</div>
        <div>warrantyFiled</div>
        <div>claimNumber</div>
      </div>
      <div class="grid grid-cols-5 justify-center gap-4 my-3">
        <div>{selectedEntry.defectiveQuantity}defectiveQuantity</div>
        <div>{selectedEntry.defectiveDesc}defectiveDesc</div>
        <div>{selectedEntry.defectiveSerial}defectiveSerial</div>
        <div>{selectedEntry.warrantyFiled}warrantyFiled</div>
        <div>{selectedEntry.claimNumber}claimNumber</div>
      </div>*/}
    </>
      
    ) : (
      <div>No entry found for SKU {selectedSku}</div>
    )}
  </div>
  );

  }
}

export default YourFunctionalComponent;
