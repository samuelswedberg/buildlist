using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Numerics;

namespace buildlist.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BuildListController : ControllerBase
    {
        private IConfiguration _configuration;
        public BuildListController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpGet]
        [Route("GetBuildList")]
        public JsonResult GetBuildList()
        {
            string query = "select * from dbo.BuildList";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("buildlistDBcon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult(table);
        }

        [HttpGet]
        [Route("GetMaintenanceList")]
        public JsonResult GetMaintenanceList()
        {
            string query = "select * from dbo.maintenancelist";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("buildlistDBcon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult(table);
        }

        [HttpGet]
        [Route("GetWarrantyList")]
        public JsonResult GetWarrantyList()
        {
            string query = "select * from dbo.warrantylist";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("buildlistDBcon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult(table);
        }
        [HttpPost]
        [Route("AddSku")]
        public IActionResult AddSkus([FromForm] long newSku)
        {
            string query = "INSERT INTO dbo.buildlist (sku, make, model, color, size, quantity, priority)\r\nSELECT Sku, Make, Model, Color, Size, 1, 1\r\nFROM skulist\r\nWHERE Sku = @newSku;";
            //string query = "insert into dbo.BuildList (sku, quantity, priority) values(@newSku, 1, 1)";
            string sqlDatasource = _configuration.GetConnectionString("buildlistDBcon");
            DataTable table = new DataTable();
            try
            {
                using (SqlConnection myCon = new SqlConnection(sqlDatasource))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@newSku", newSku);
                        int rowsAffected = myCommand.ExecuteNonQuery();
                        if (rowsAffected > 0) { return Ok(); }
                        else
                        {
                            return NotFound(new { error = "SKU not found in skulist" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = $"Invalid Sku. (Error: {ex.Message})" });
            }
        }

        [HttpDelete]
        [Route("DeleteSku")]
        public JsonResult DeleteSkus(int id)
        {
            string query = "delete from dbo.BuildList where id=@id";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("buildlistDBcon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@id", id);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult("Deleted Successfully");
        }

        [HttpPatch]
        [Route("RemoveDupes")]
        public JsonResult RemoveDupes()
        {
            string query = "-- Create a temporary table to store the aggregated data\r\nSELECT sku, SUM(quantity) AS TotalQuantity\r\nINTO #TempTable\r\nFROM dbo.buildlist\r\nGROUP BY sku;\r\n\r\n-- Update the original table with the total quantity\r\nUPDATE b\r\nSET b.quantity = t.TotalQuantity\r\nFROM dbo.buildlist b\r\nJOIN #TempTable t ON b.sku = t.sku;\r\n\r\n-- Remove duplicate rows\r\nWITH CTE AS (\r\n    SELECT sku, quantity,\r\n           ROW_NUMBER() OVER (PARTITION BY sku ORDER BY (SELECT NULL)) AS RowNum\r\n    FROM dbo.buildlist\r\n)\r\nDELETE FROM CTE WHERE RowNum > 1;\r\n\r\n-- Drop the temporary table\r\nDROP TABLE #TempTable;";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("buildlistDBcon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult("RemoveDupes Successful");
        }
    }
}
