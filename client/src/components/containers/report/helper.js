// create an array of chunked arraies size of size param
function _chunk(array, size) {
  const chunked_arr = [];
  for (let i = 0; i < array.length; i++) {
    const last = chunked_arr[chunked_arr.length - 1];
    if (!last || last.length === size) {
      chunked_arr.push([array[i]]);
    } else {
      last.push(array[i]);
    }
  }
  return chunked_arr;
}

function _checkUndefined(data) {
  return data === undefined;
}

function _returnIfNotUndefined(data) {
  if (data !== undefined) {
    return data;
  }
  return null;
}

function _getStatsForDiscplines(start, end, appArr) {
  const TYPE = { PT: "PT", PTRA: "PTRA", OT: "OT", OTRA: "OTRA", SLP: "SLP", SLPA: "SLPA" };
  let medians = [0, 0, 0, 0, 0, 0];
  let numAttend = [0, 0, 0, 0, 0, 0];
  let numMiss = [0, 0, 0, 0, 0, 0];

  if (appArr === undefined || appArr.length === 0) {
    return { mediansMin: medians, numOfAttend: numAttend, numOfMiss: numMiss };
  }

  // Remove special characters, reverse year order, and parseInt
  let startDate = start.replace(/[^0-9]/g, "");
  startDate = reverseYear(startDate);
  startDate = parseInt(startDate);

  // Remove special characters, reverse year order, and parseInt
  let endDate = end.replace(/[^0-9]/g, "");
  endDate = reverseYear(endDate);
  endDate = parseInt(endDate);

  // Filter appointments within the admission and discahrge dates
  const filteredAppArr = appArr.filter((appointment) => {
    const appStart = parseInt(appointment.startDate.replace(/[^0-9]/g, "").substring(0, 8));
    // const appEnd = parseInt(appointment.endDate.replace(/[^0-9]/g, "").substring(0, 8));
    return startDate <= appStart && endDate >= appStart;
  });

  let PTs = [0];
  let PTRAs = [0];
  let OTs = [0];
  let OTRAs = [0];
  let SLPs = [0];
  let SLPAs = [0];
  let PTattend = 0;
  let PTRAattend = 0;
  let OTattend = 0;
  let OTRAattend = 0;
  let SLPattend = 0;
  let SLPAattend = 0;
  let PTmiss = 0;
  let PTRAmiss = 0;
  let OTmiss = 0;
  let OTRAmiss = 0;
  let SLPmiss = 0;
  let SLPAmiss = 0;
  let j = 0;
  let k = 0;
  let a = 0;
  let b = 0;
  let c = 0;
  let d = 0;

  for (let i = 0; i < filteredAppArr.length; i++) {
    switch (filteredAppArr[i].therapyType) {
      case TYPE.PT:
        PTs[j] = filteredAppArr[i].duration;
        j++;
        filteredAppArr[i].isAttend === 1 ? PTattend++ : PTmiss++;
        break;

      case TYPE.PTRA:
        PTRAs[k] = filteredAppArr[i].duration;
        k++;
        filteredAppArr[i].isAttend === 1 ? PTRAattend++ : PTRAmiss++;
        break;

      case TYPE.OT:
        OTs[a] = filteredAppArr[i].duration;
        a++;
        filteredAppArr[i].isAttend === 1 ? OTattend++ : OTmiss++;
        break;

      case TYPE.OTRA:
        OTRAs[b] = filteredAppArr[i].duration;
        b++;
        filteredAppArr[i].isAttend === 1 ? OTRAattend++ : OTRAmiss++;
        break;

      case TYPE.SLP:
        SLPs[c] = filteredAppArr[i].duration;
        c++;
        filteredAppArr[i].isAttend === 1 ? SLPattend++ : SLPmiss++;
        break;

      default:
        SLPAs[d] = filteredAppArr[i].duration;
        d++;
        filteredAppArr[i].isAttend === 1 ? SLPAattend++ : SLPAmiss++;
    }
  }

  const PTmed = getMedian(PTs);
  const PTRAmed = getMedian(PTRAs);
  const OTmed = getMedian(OTs);
  const OTRAmed = getMedian(OTRAs);
  const SLPmed = getMedian(SLPs);
  const SLPAmed = getMedian(SLPAs);

  return {
    mediansMin: [PTmed, PTRAmed, OTmed, OTRAmed, SLPmed, SLPAmed],
    numOfAttend: [PTattend, PTRAattend, OTattend, OTRAattend, SLPattend, SLPAattend],
    numOfMiss: [PTmiss, PTRAmiss, OTmiss, OTRAmiss, SLPmiss, SLPAmiss]
  };

  function getMedian(arr) {
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
  }
  function reverseYear(str) {
    const year = str.slice(-4);
    const monthDay = str.substring(0, str.length - 4);
    return year.concat(monthDay);
  }
}
/**
 * @param start is the start date
 * @param end is the end date
 * @param appArr is appointment array.
 * 			  			 An appointment : { appointmentId: Integer,
 * 																	duration: Integer,
 * 																	endDate: string,
 * 																	startDate: string }
 * @return the object that contains average, median, maximum, and minimum
 * */
function _getStats(start, end, appArr) {
  if (appArr === undefined || appArr.length === 0) {
    return { average: 0, median: 0, minimum: 0, maximum: 0 };
  }

  // Remove special characters, reverse year order, and parseInt
  let startDate = start.replace(/[^0-9]/g, "");
  startDate = reverseYear(startDate);
  startDate = parseInt(startDate);

  // Remove special characters, reverse year order, and parseInt
  let endDate = end.replace(/[^0-9]/g, "");
  endDate = reverseYear(endDate);
  endDate = parseInt(endDate);

  // Filter appointments within the admission and discahrge dates
  const filteredAppArr = appArr.filter((appointment) => {
    const appStart = parseInt(appointment.startDate.replace(/[^0-9]/g, "").substring(0, 8));
    return startDate <= appStart && endDate >= appStart;
  });

  // Map only duration
  const filteredDurationArr = filteredAppArr.map((appointment) => {
    return appointment.duration;
  });

  if (filteredDurationArr.length === 0) {
    return { average: 0, median: 0, minimum: 0, maximum: 0 };
  }

  const sortedDurationArr = [...filteredDurationArr].sort((a, b) => a - b);

  const counts = sortedDurationArr.length;
  const sum = getSum(sortedDurationArr);
  const average = Math.round(sum / counts);

  const maximum = sortedDurationArr[counts - 1];

  const minimum = sortedDurationArr[0];

  const median = getMedian(sortedDurationArr);

  return { average, median, minimum, maximum };

  function getSum(arr) {
    const sum = (total, num) => total + num;
    return arr.reduce(sum);
  }
  function getMedian(arr) {
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
  }
  function reverseYear(str) {
    const year = str.slice(-4);
    const monthDay = str.substring(0, str.length - 4);
    return year.concat(monthDay);
  }
}

export const helper = {
  _chunk,
  _checkUndefined,
  _returnIfNotUndefined,
  _getStats,
  _getStatsForDiscplines
};
