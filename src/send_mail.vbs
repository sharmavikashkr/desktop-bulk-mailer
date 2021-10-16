Option Explicit

Dim toAddr, ccAddr, subject, files
toAddr = WScript.Arguments(0)
ccAddr = WScript.Arguments(1)
subject = WScript.Arguments(2)
files = WScript.Arguments(3)

Dim OA
Dim mag

Set OA = CreateObject("outlook.Application")
Set mag = OA.createitem(0)

mag.TO = toAddr
mag.CC = ccAddr
mag.Subject = subject
mag.BODY = "Hello"

Dim Attachments
Dim i
If files <> "" Then
    Attachments = Split(files, ",")
    For i = LBound(Attachments) To UBound(Attachments)
        If Attachments(i) <> "" Then
            Wscript.Echo Trim(Attachments(i))
            mag.Attachments.Add Trim(Attachments(i))
        End If
    Next
End If

mag.send