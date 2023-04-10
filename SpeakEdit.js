cfg.Dark;

var funs;
var path = "/sdcard/voice_docs/";
var tools = [ "[fa-microphone]", "[fa-bold]3", "[fa-bold]4", "[fa-edit]", "[fa-undo]", "[fa-repeat]"  ]
var files;
var file;
var filename = "new_file";

if(!app.FolderExists())
    app.MakeFolder(path);
files = app.ListFolder(path);
app.SetBackColor( "#222222" );
function OnStart()
{
    lay = app.CreateLayout( "linear", "Vertical, FillXY" );
    lay.SetBackColor( "#000001" );
    
    edit = app.AddTextEdit( lay, "", 1, 0.93);
    edit.SetOnChange(function(e)
    {
        app.WriteFile(path+filename, edit.GetText());
    })
   
    
    scroller = app.AddScroller( lay ,1,-1, "Horizontal,FillX" );
    
    app_bar = app.AddLayout( lay, "linear", "Horizontal,FillX" );
    app_bar.SetBackColor( "#222222" );
    for (i in tools)
    {
      var tool = app.AddText( app_bar, tools[i], 1/6, -1, "FontAwesome" );
      tool.SetMargins( 0.005, 0.001, 0.005, 0.001 );
      tool.SetPadding( 0.01, 0.015, 0.01, 0.015 );
      tool.index = i;
      tool.SetBackColor( "#29e6ff" );
      tool.SetTextColor( "#222222" );
      tool.SetTextSize( 14);
      
      tool.SetOnTouchDown( 
      function (e)
      {
            funs[this.index]();
          
      });
    }

    app.AddLayout( lay );
    file_drawer();
    

    speech = app.CreateSpeechRec("nobeep");
    speech.SetOnReady( speech_OnReady );
    speech.SetOnResult( speech_OnResult );
    speech.SetOnError( speech_OnError );
    
}

app.SetOnShowKeyboard(function ()
{
	let sh  =  app.GetDisplayHeight(  )
  let kh  =  app.GetKeyboardHeight()
  let sd  =  app.GetScreenDensity()

  if(kh != 0){
     edit.SetSize( 1, 1-((kh)/sh ) - 0.07)
  }else{
    edit.SetSize( 1, 0.93 )
}
  
}
 )

function recog()
{
    speech.Recognize();
}

function speech_OnReady()
{
  
}

function speech_OnResult( results )
{
    
    app.ShowPopup( "Listening")
    
    if(!speech.IsListening()){
      console.log(results)
      let len = results.length
      start = edit.GetSelectionStart()
      text = process_text(results[0]);
      edit.InsertText( text, start )
      speech.Recognize()
      
    }
   
   
}

function speech_OnError()
{
    app.ShowPopup( "Please speak more clearly!" );
    speech.Recognize()
}

function insert_text(choice)
{
	let cursor_pos = edit.GetSelectionStart();
	choice = process_text(choice);
	let text_length = choice.length;
	edit.InsertText( choice , cursor_pos )
	edit.SetCursorPos( cursor_pos + text_length )
}

function file_drawer()
{
  drawer_lay = app.CreateLayout("linear", "Vertical, Left, FillXY");
  file_btn = app.AddButton(drawer_lay, "New File", 0.4, -1);
  file_btn.SetOnTouch(function(e)
  {
      dlg = app.CreateDialog("New File");
      let dlg_lay = app.CreateLayout("Linear", "VCenter");
      let fl_lay = app.CreateLayout("Linear", "Horizontal");
      let title = app.AddText(fl_lay, "Filename:", 0.3, -1);
      let file_name = app.AddTextEdit(fl_lay, "", 0.5, -1, "SingleLine");
      let ok_btn = app.CreateButton("OK", 0.5, -1);
      
      dlg_lay.AddChild(fl_lay);
      dlg_lay.AddChild(ok_btn);
      dlg.AddLayout(dlg_lay);
      ok_btn.SetOnTouch(function()
      {
          let f_name = file_name.GetText();
          filename = f_name;
          files_list.AddItem(f_name);
          edit.SetText("");
          dlg.Hide();
      })
      dlg.Show();
  })
  drawer_lay.SetBackColor("#111111");
  files_list = app.CreateList(files.sort((a,b)=>b-a), 0.8, -1);
  files_list.SetOnTouch(function(title)
  {
      edit.SetText(app.ReadFile(path+title));
      filename = title;
      app.CloseDrawer("right");
  })
  drawer_lay.AddChild(files_list);
  app.AddDrawer(drawer_lay, "right", 0.8);
}

function process_text(text)
{
	if(text.match(/^(what|how|when|who|which|why|can\syou|are\syou)/i)){
	   text += "? ";
	}else{
	  text += " "
	}
	
	if(text.match(/except$/i)){
	  text += "_____";
	}
	try{
	first_letter = text[0].toUpperCase();
	} catch(e){
	  alert(e);
	}
	
	my_text = text.replace(/Dash/gi, "_____");
	final_text = my_text.replace(/./i, first_letter);
	
	return remove_d(final_text);
}

function insert_option()
{
  let cursor_pos = edit.GetSelectionStart()
	edit.InsertText( "(a) (b) (c)\n" ,cursor_pos)
}
function insert_option2()
{
  let cursor_pos = edit.GetSelectionStart()
	edit.InsertText( "(a) (b) (c) (d)\n" ,cursor_pos)
}
function f()
{
}
function insert_dash()
{
	edit.InsertText( "____", edit.GetSelectionStart() )
}
function undo()
{
    edit.Undo();
}

function redo()
{
    edit.Redo();
}

function remove_d(txt)
{
    return (txt.replace(/D____/g, "____"));
}
  funs = [
  recog, 
  insert_option, 
  insert_option2,
  insert_dash,
  undo,
  redo
  ]