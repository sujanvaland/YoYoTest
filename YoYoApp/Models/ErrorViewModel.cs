using System;

namespace YoYoApp.Models
{
    public class ErrorViewModel
    {
        public string RequestId { get; set; }

        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
    }

    public class FitnessData
    {
        public string AccumulatedShuttleDistance { get; set; }
        public string SpeedLevel { get; set; }
        public string ShuttleNo { get; set; }
        public string Speed { get; set; }
        public string LevelTime { get; set; }
        public string CommulativeTime { get; set; }
        public string StartTime { get; set; }
        public string ApproxVo2Max { get; set; }
    }

    public class AthleteData
    {
        public string SrNo { get; set; }
        public string Name { get; set; }
        public string Warning { get; set; }
        public string Shuttle { get; set; }
        public string SpeedLevel { get; set; }
        public string Result { get; set; }
    }
}
