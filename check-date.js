function isTodayBetweenDates(startDate, endDate) {
  const today = new Date();
  const start = new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = new Date(today.getFullYear(), endDate.getMonth(), endDate.getDate())
  console.log("Start date: ", start)
  console.log("End date: ", end)
  return (today >= start && today <= end);
}

const startDate = new Date('2026-03-15');
const endDate = new Date('2026-03-31');
const isTodayInRange = isTodayBetweenDates(startDate, endDate);
console.log("Is today between", startDate, " and ", endDate)
console.log("Result: ", isTodayInRange);
return isTodayInRange
