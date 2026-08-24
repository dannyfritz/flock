type sw = {
	elapsed: float,
	reset: () => unit,
	tick: (float) => unit,
}
type t = {
	canRollover: bool,
	elapsed: float,
	percent_elapsed: float,
	remaining: float,
	isFinished: bool,
	duration: float,
	stopwatch: sw,
	reset: () => unit,
	rololver: () => unit,
	tick: (float) => unit,
}
@new @module("@dannyfritz/flock/time") external stopwatch: unit => sw = "Stopwatch"
@new @module("@dannyfritz/flock/time") external timer: float => t = "Timer"
let _t = timer(10.)
Console.log(_t)
Console.log(_t.duration)
Console.log(_t.tick(9.))
Console.log(_t.duration)
Console.log(_t)
