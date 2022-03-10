

^e::
{
	A_Clipboard:=""
	Send("^c")
	if !ClipWait(1)
	{
		Return
	}
	ns := A_Clipboard
	output := ""
	start := 0
	Loop Parse A_Clipboard, "`n", "`r"
	{
		if(start==1) {
			output.="`n"
			start := 2
		}else if(start>1) {
			line:=RegExReplace(A_LoopField, "(->MCU|MCU->|APP->|->APP)", ":guilabel:``$1``")
			line:=RegExReplace(line, "[ ]*(0x[0-9a-fA-F]+|\d+)\s*", " ````$1```` ")
			if(sp:=RegExMatch(line, "\(")) {
				line:=RegExReplace(line, "\s*````(.+?)````\s*", " $1 ",,,sp)
			}
			line:=RegExReplace(line, "\(\s*(.+?)\s*\)", ":guilabel:``$1``")
			line:="`t|" line
			output.=line "`n"
		} else {
			if(RegExMatch(A_LoopField, "m)(例.*)\:\:")) {
				start := 1
				output.=RegExReplace(A_LoopField, "m)(例.*)\:\:", ".. admonition:: $1")
			}
			output.="`n"
		}
	}
	A_Clipboard := output
	Send("^v")
}

F5::ExitApp
F6::Reload
