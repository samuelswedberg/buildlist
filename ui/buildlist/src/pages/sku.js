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
    buildlist:[]
  }
}

API_URL="http://localhost:5204/";

componentDidMount(){
  this.refreshBuildList();
}

async refreshBuildList(){
  fetch(this.API_URL+"api/buildlist/GetBuildList").then(response=>response.json())
  .then(data=>{
    this.setState({buildlist:data});
  })
}


render() {
  const{buildlist}=this.state;
  
  // Access the navigate function from props
  const { navigate } = this.props;

  // Use the navigate function to access URL parameters
  const queryParams = new URLSearchParams(window.location.search); 

  const selectedSku = queryParams.get('sku');
  const selectedEntry = buildlist.find(entry => entry.sku === selectedSku);
  
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
          <input id="newSku" onKeyDown={(e) => {if (e.key === "Enter") {this.addClick()}}} class="placeholder:text-black block bg-white border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" value={selectedEntry.quantity} type="text"/>
          {selectedEntry.inBoxQuantity}inBoxQuantity
          </div>
      </div>
      {/* Maintenance Info */}
      <div class="grid grid-cols-2 justify-center gap-4 my-3 font-bold">
        <div>maintenanceQuantity</div>
        <div>maintenanceDesc</div>
      </div>
      <div class="grid grid-cols-2 justify-center gap-4 my-3">
        <div>{selectedEntry.maintenanceQuantity}maintenanceQuantity</div>
        <div>{selectedEntry.maintenanceDesc}maintenanceDesc</div>
      </div>
      {/* Defective Info */}
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
      </div>
    </>
      
    ) : (
      <div>No entry found for SKU {selectedSku}</div>
    )}
  </div>
  );

  }
}

export default YourFunctionalComponent;
