using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using YoYoApp.Models;

namespace YoYoApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public List<FitnessData> GetFitnessTestData()
        {
            using (StreamReader r = new StreamReader("fitnessrating_beeptest.json"))
            {
                string json = r.ReadToEnd();
                List<FitnessData> items = JsonConvert.DeserializeObject<List<FitnessData>>(json);
                return items;
            }
        }

        [HttpGet]
        public List<AthleteData> GetAthleteData()
        {
            using (StreamReader r = new StreamReader("athletedata.json"))
            {
                string json = r.ReadToEnd();
                List<AthleteData> items = JsonConvert.DeserializeObject<List<AthleteData>>(json);
                return items;
            }
        }
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
