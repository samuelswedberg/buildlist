import '../App.css';
import { Component } from 'react';
import { FaDeleteLeft } from "react-icons/fa6";

class Buildlist extends Component{

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

// async addClick(){
//   var newSku = document.getElementById("newSku").value;
//   const data = new FormData();
//   data.append("newSku", newSku);

//   fetch(this.API_URL+"api/buildlist/AddSku",{
//     method:"POST",
//     body:data
//   }).then(res=>res.json())
//   .then((result)=>{
//     alert(result);
//     this.refreshBuildList();
//   })
// }

async addClick() {
  var newSku = document.getElementById("newSku").value;

  try {
    const data = new FormData();
    data.append("newSku", newSku);
    const response = await fetch(this.API_URL + "api/buildlist/AddSku", {
      method: "POST",
      body:data,
    });

    if (response.ok) {
      this.refreshBuildList();
    } else if (response.status === 404) {
      // Handle 404 Not Found
      const errorData = await response.json();
      alert(errorData.error);
    } else {
      // Handle other status codes or errors
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
    }
  } catch (error) {
    // Handle network errors or other exceptions
    alert(`Error: ${error.message}`);
  }
  this.removeDupes()
}

async deleteClick(id){
  fetch(this.API_URL+"api/buildlist/DeleteSku?id="+id,{
    method:"DELETE",
  }).then(res=>res.json())
  .then((result)=>{
    // alert(result);
    this.refreshBuildList();
  })
}

async removeDupes(){
  fetch(this.API_URL+"api/buildlist/RemoveDupes",{
    method:"PATCH",
  }).then(res=>res.json())
  .then((result)=>{
    // alert(result);
    this.refreshBuildList();
  })
}

render() {
  const{buildlist}=this.state;
  return (
    <div className="App">
      <h2 class="text-4xl">Build List</h2>
      <div class="grid grid-flow-col auto-cols-max my-3 justify-center font-bold">
        <input id="newSku" onKeyDown={(e) => {if (e.key === "Enter") {this.addClick()}}} class="placeholder:italic placeholder:text-slate-400 block bg-white border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Enter SKU" type="text"/>&nbsp;
        {/* <button class="rounded-md bg-slate-600 p-2 m-2 text-white" onClick={()=>this.addClick()}>Add Sku</button> 
        <button class="rounded-md bg-slate-600 p-2 m-2 text-white" onClick={()=>this.removeDupes()}>Update Quantities</button>*/}
      </div>
      <div class="grid grid-cols-8 gap-4 my-3 justify-center font-bold">
        <div>SKU</div>
        <div>MAKE</div>
        <div>MODEL</div>
        <div>COLOR</div>
        <div>SIZE</div>
        <div>QUANTITY</div>
        <div>PRIORITY</div>
        <div>Delete</div>
      </div>
      {buildlist.map(entry=>
        <div class="grid grid-cols-8 justify-center gap-4 my-3">
              <a class="underline" href={'/sku?sku=' + entry.sku}>{entry.sku}</a>
              <div>{entry.make}</div>
              <div>{entry.model}</div>
              <div>{entry.color}</div>
              <div>{entry.size}</div>
              <div>{entry.quantity}</div>
              <div>{entry.priority}</div>
              <div class="flex justify-center"><button class="text-black hover:text-red-600" onClick={()=>this.deleteClick(entry.id)}><FaDeleteLeft  size={20}/></button></div>
        </div>
      )}
    </div>
  );
}
}

export default Buildlist;
