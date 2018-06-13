DBFX.RegisterNamespace("DBFX.Web.Controls");
DBFX.RegisterNamespace("DBFX.Serializer");
DBFX.RegisterNamespace("DBFX.Design");
DBFX.RegisterNamespace("DBFX.Design.ControlDesigners");

//控件集合
DBFX.Web.Controls.ControlsCollection = function (pc) {

    var cc = new Array();
    cc.HostConttol = pc;
    cc.NamedControls = new Object();

    cc.RegistNamedControl = function (name, c) {

        if (c == undefined) {
            throw ("被加入的控件必须是 Control 类型！");
        }

        if (name != undefined && name!="") {
            if (cc.NamedControls[name] != undefined) {
                throw ("已经存在名称为 " + name + " 的控件!");
            }
            else {

                cc.NamedControls[name] = c;
            }
        }

    }

    cc.Add = function (c) {

        cc.push(c);
        if (c.Name != null && c.Name != undefined) {
            cc.RegistNamedControl(c.Name, c);
        }

    }

    cc.Remove = function (c) {

        var idx = cc.indexOf(c);
        if (idx >= 0)
            cc.splice(idx, 1);

        if (c.name != undefined &&  c.name!="" && cc.NamedControls[c.name]!=undefined)
            eval("delete cc.NamedControls." + name);

    }

    cc.Clear = function () {

        cc.NamedControls = new Object();
        cc.splice(0, cc.length);

    }

    return cc;

}

//控件公共上下文
DBFX.Web.Controls.Context = new Object();

//创建UI基础对象
function UIObject(t) {

    var uiobj = new Object();
    uiobj.Base = new Object();

    //if (t != undefined)
    //    uiobj.ObjType = t;

    Object.defineProperty(uiobj, "ObjType", {
        get: function () {
            if (t == undefined)
                throw ("对象类型错误");

            return t;
        },
        set: function (v) {
            if (t == undefined)
                t = v;
        }
    });


    //获取对象类型
    uiobj.GetType = function () {
        //uiobj.ObjType = t;
        return t;
    }
    uiobj.Base.GetType = uiobj.GetType;
    //设置类描述器
    uiobj.ClassDescriptor = new DBFX.ComponentsModel.ClassDescriptor();
    uiobj.Base.ClassDescriptor = uiobj.ClassDescriptor;
    //设置数据属性
    Object.defineProperty(uiobj, "DataProperty", {
        get: function () {

            return uiobj.dataProperty;

        },
        set: function (v) {

            var odp = uiobj.dataProperty;
            try{
                uiobj.dataProperty = v;

                if (odp != undefined && odp != "" && uiobj.FormContext!=undefined) {

                    if (uiobj.dataDomain != undefined && uiobj.dataDomain != "") {

                        eval("delete uiobj.FormContext." + uiobj.dataDomain + "." + uiobj.dataProperty + ";");

                    }
                    else {
                        eval("delete uiobj.FormContext." +uiobj.dataProperty + ";");
                    }

                }

                if (uiobj.SetDataProperty != undefined)
                    uiobj.SetDataProperty(v);
            } catch (ex) {
                alert(ex.toString());
            }

        }
    });


    Object.defineProperty(uiobj, "DataDomain", {
        get: function () {

            return uiobj.dataDomain;
        },
        set: function (v) {

            try{
                var odomain=uiobj.dataDomain;

                uiobj.dataDomain = v;

                if (v != undefined && v != null && uiobj.FormContext != undefined) {

                    var ddv = uiobj.FormContext[v];
                    if (ddv == undefined && v != "") {
                        ddv = new DBFX.DataDomain();
                        uiobj.FormContext[v] = ddv;
                    }
                    if (uiobj.dataProperty != undefined && uiobj.dataProperty!="")
                        ddv[uiobj.dataProperty] = "";

                }

                if (uiobj.FormContext != undefined && odomain!=v ) {

                    var oddv = uiobj.FormContext[odomain];
                    if (odomain == "")
                        oddv = uiobj.FormContext;

                    if (oddv != undefined && uiobj.dataProperty!=undefined && uiobj.dataProperty!="") {

                        eval("delete oddv." + uiobj.DataProperty + ";");

                        uiobj.RegisterFormContext();

                    }

                }


                if (uiobj.SetDataDomain != undefined)
                    uiobj.SetDataDomain(v);
            } catch (ex) {

                alert(ex.toString());
            }

        }
    });

    uiobj.bindings = Array();
    //按照名称获取绑定
    uiobj.bindings.GetBinding = function (name) {

        var bd = undefined;
        for (var i = 0; i < uiobj.bindings.length; i++) {

            if (uiobj.bindings[i].PropertyName == name) {
                bd = uiobj.bindings[i];
                break;
            }

        }

        return bd;

    }

    Object.defineProperty(uiobj, "Bindings", {
        get: function () {
            return uiobj.bindings;
        }
    });

    uiobj.ExecuteBinding = function () {

        for (var i = 0; i < uiobj.Bindings.length; i++) {



        }

    }
    uiobj.Base.ExecuteBinding = uiobj.ExecuteBinding;
    uiobj.Dispose = function () {

    }

    

    return uiobj;

}

//控件基类
DBFX.Web.Controls.Control = function (v) {

    var ctrl = null;
    if (v != undefined)
        ctrl = new UIObject(v);
    else
        ctrl = new UIObject("Control");

    ctrl.IsCanSetting = false;
    ctrl.IsCanResize = 1;
    ctrl.ClassDescriptor.DisplayName = "UI基础控件";
    ctrl.ClassDescriptor.Description = "为UI提供基础实现";
    ctrl.ClassDescriptor.Serializer = null;
    ctrl.ClassDescriptor.DesignTimePreparer = "DBFX.Design.GeneralDesignTimePreparer";
    ctrl.ClassDescriptor.Designers = ["DBFX.Design.ControlDesigners.ObjectGeneralDesigner", "DBFX.Design.ControlDesigners.LayoutDesigner", "DBFX.Design.ControlDesigners.BBCDesigner", "DBFX.Design.ControlDesigners.FontDesigner"];

    ctrl.IsContainer = false;
    ctrl.FormContext = undefined;
    ctrl.VisualElement = document.createElement("DBC");
    ctrl.ClientDiv = ctrl.VisualElement;
    ctrl.OnCreateHandle = function () {

        ctrl.ClientDiv = ctrl.VisualElement;
        ctrl.VisualElement.onmousedown = ctrl.OnMouseDown;
        ctrl.VisualElement.onmouseup = ctrl.OnMouseUp;
        ctrl.VisualElement.onmousemove = ctrl.OnMouseMove;
        ctrl.VisualElement.onmouseenter = ctrl.OnMouseEnter;
        ctrl.VisualElement.onmouseout = ctrl.OnMouseOut;
        ctrl.VisualElement.onmousewheel = ctrl.OnMouseWheel;
        ctrl.VisualElement.onclick = ctrl.OnClick;
        ctrl.VisualElement.ondblclick = ctrl.OnDblClick;
        ctrl.VisualElement.ondragstart = ctrl.OnDragStart;
        ctrl.VisualElement.ondragover = ctrl.OnDragOver;
        ctrl.VisualElement.ondrop = ctrl.OnDrop;
        ctrl.VisualElement.ondragleave = ctrl.OnDragLeave;
        ctrl.VisualElement.oncontextmenu = ctrl.ShowContextMenu;
        ctrl.VisualElement.onkeydown = ctrl.OnKeyDown;
        ctrl.VisualElement.onkeyup = ctrl.OnKeyUp;
        ctrl.VisualElement.onkeypress = ctrl.OnKeypress;
        ctrl.VisualElement.ontouchstart = ctrl.OnTouchStart;
        ctrl.VisualElement.ontouchmove = ctrl.OnTouchMove;
        ctrl.VisualElement.ontouchend = ctrl.OnTouchEnd;

        //ctrl.VisualElement.id = ctrl.VisualElement.uniqueID
        ctrl.AllowDrop = false;
        ctrl.VisualElement.ParentObject = ctrl;
        ctrl.ClientDiv = ctrl.VisualElement;

    }
    
    ctrl.OnTouchStart = function (e) {
        if (ctrl.OnTouchStart != undefined && typeof ctrl.TouchStart=="function")
            ctrl.TouchStart(e);
    }

    ctrl.OnTouchMove = function (e) {
        if (ctrl.TouchMove != undefined && typeof ctrl.TouchStart == "function")
            ctrl.TouchMove(e);
    }

    ctrl.OnTouchEnd = function (e) {
        if (ctrl.TouchEnd != undefined && typeof ctrl.TouchStart == "function")
            ctrl.TouchEnd(e);
    }


    ctrl.Base.OnCreateHandle = ctrl.OnCreateHandle;

    ctrl.designTime = false;

    Object.defineProperty(ctrl, "Width", {
        get: function ()
        { return ctrl.VisualElement.style.width; },
        set: function (v) {


            ctrl.SetWidth(v);

            ctrl.OnResized();

            if (ctrl.width != v) {
                ctrl.width = v;
                ctrl.OnPropertyChanged("Width", v);
            }
        }
    });

    Object.defineProperty(ctrl, "MinWidth", {
        get: function ()
        { return ctrl.VisualElement.style.minWidth; },
        set: function (v) {

            if (v != undefined && v != null) {
                
                if (ctrl.ClientDiv != null) {
                    ctrl.ClientDiv.style.minWidth = v;
                }
                else
                    ctrl.VisualElement.style.minWidth = v;

                ctrl.OnResized();

                if (ctrl.minWidth != v) {
                    ctrl.minWidth = v;
                    ctrl.OnPropertyChanged("MinWidth", v);
                }
            }

        }
    , enumerable: false
    });

    Object.defineProperty(ctrl, "MinHeight", {
        get: function ()
        { return ctrl.VisualElement.style.minHeight; },
        set: function (v) {
            if (v != undefined && v != null) {
                if (ctrl.ClientDiv != null) {
                    ctrl.ClientDiv.style.minHeight = v;
                }
                else
                    ctrl.VisualElement.style.minHeight = v;
                ctrl.OnResized();


                if (ctrl.minHeight != v) {
                    ctrl.minHeight = v;
                    ctrl.OnPropertyChanged("MinHeight", v);
                }
            }
        }
    });

    Object.defineProperty(ctrl, "MaxWidth", {
        get: function ()
        {
            return ctrl.VisualElement.style.maxWidth;
        },
        set: function (v) {

            if (v != undefined && v != null) {

                if (ctrl.ClientDiv != null) {
                    ctrl.ClientDiv.style.maxWidth = v;
                }
                else
                    ctrl.VisualElement.style.maxWidth = v;

                ctrl.OnResized();

                if (ctrl.maxWidth != v) {
                    ctrl.maxWidth = v;
                    ctrl.OnPropertyChanged("MaxWidth", v);
                }
            }

        }
    });

    Object.defineProperty(ctrl, "MaxHeight", {
        get: function ()
        { return ctrl.VisualElement.style.maxHeight; },
        set: function (v) {
            if (v != undefined && v != null) {
                if (ctrl.ClientDiv != null) {
                    ctrl.ClientDiv.style.maxHeight = v;
                }
                else
                    ctrl.VisualElement.style.maxHeight = v;

                ctrl.OnResized();


                if (ctrl.maxHeight != v) {
                    ctrl.maxHeight = v;
                    ctrl.OnPropertyChanged("MaxHeight", v);
                }
            }
        }
    });


    Object.defineProperty(ctrl, "Height", {
        get: function ()
        { return ctrl.VisualElement.style.height; },

        set: function (v) {

            ctrl.SetHeight(v);
            ctrl.OnResized();

            if (ctrl.height != v) {
                ctrl.height = v;
                ctrl.OnPropertyChanged("Height", v);
            }
        }
    });

    Object.defineProperty(ctrl, "Float", {
        get: function ()
        { return ctrl.float; },

        set: function (v) {

            if (ctrl.SetFloat == undefined) {

                if (v != undefined && v != null)
                    ctrl.VisualElement.style.float = v;

                if (ctrl.float != v) {
                    ctrl.float = v;
                    ctrl.OnPropertyChanged("Float", v);
                }
            }
            else {

                ctrl.float = v;
                ctrl.SetFloat();
            }

        }
    });


    Object.defineProperty(ctrl, "Left", {
        get: function ()
        { return ctrl.VisualElement.style.left; },

        set: function (v) {

            
            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.left = v;

            }
            else
                ctrl.VisualElement.style.left = v;

            if (ctrl.left != v) {
                ctrl.left = v;
                ctrl.OnPropertyChanged("Left", v);
            }

        }
    });

    Object.defineProperty(ctrl, "Top", {
        get: function ()
        { return ctrl.VisualElement.style.top; },

        set: function (v) {

            if (v == undefined || v == null)
                return;
            
            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.top = v;

            }
            else
                ctrl.VisualElement.style.top = v;

            if (ctrl.top != v) {
                ctrl.top = v;
                ctrl.OnPropertyChanged("Top", v);
            }

        }
    });


    Object.defineProperty(ctrl, "ZIndex", {
        get: function ()
        { return ctrl.VisualElement.style.zIndex; },

        set: function (v) {

            if (v == undefined || v == null)
                return;

            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.zIndex = v;

            }
            else
                ctrl.VisualElement.style.zIndex = v;

            if (ctrl.zIndex != v) {
                ctrl.zIndex = v;
                ctrl.OnPropertyChanged("ZIndex", v);
            }
        }
    });

    Object.defineProperty(ctrl, "BorderStyle", {
        get: function () {
            if (ctrl.ClientDiv != null)
                return ctrl.ClientDiv.style.borderStyle;
            else
                return ctrl.VisualElement.style.borderStyle;
        },
        set: function (v) {


            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.borderStyle = v;

            }
            else
                ctrl.VisualElement.style.borderStyle = v;

            ctrl.OnPropertyChanged("BorderStyle", v);
        }
    });

    Object.defineProperty(ctrl, "BorderWidth", {
        get: function () {
            if (ctrl.ClientDiv != null)
                return ctrl.ClientDiv.style.borderWidth;
            else
                return ctrl.VisualElement.style.borderWidth;
        },
        set: function (v) {


            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.borderWidth = v;

            }
            else
                ctrl.VisualElement.style.borderWidth = v;

            ctrl.OnPropertyChanged("BorderWidth", v);
        }
    });

    Object.defineProperty(ctrl, "BorderColor", {
        get: function () {
            if (ctrl.ClientDiv != null)
                return ctrl.ClientDiv.style.borderColor;
            else
                return ctrl.VisualElement.style.borderColor;
        },
        set: function (v) {


            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.borderColor = v;

            }
            else
                ctrl.VisualElement.style.borderColor = v;

            ctrl.OnPropertyChanged("BorderColor", v);
        }
    });


    Object.defineProperty(ctrl, "BorderRadius", {
        get: function ()
        { return ctrl.VisualElement.style.borderRadius; },

        set: function (v) {

            if (v == undefined || v == null)
                return;

            ctrl.borderRadius = v;

            ctrl.SetBorderRadius(v);

        }
    });


    Object.defineProperty(ctrl, "DataContext", {
        get: function ()
        { return this.dataContext; },

        set: function (v) {

            var e = new Object();
            e.OldValue = this.dataContext;
            e.Value = v;
            ctrl.dataContext = v;
            ctrl.DataContextChanged(e);
            ctrl.OnPropertyChanged("DataContext", v);
        }
    });


    Object.defineProperty(ctrl, "Margin", {
        get: function ()
        {
            if (this.ClientDiv != null) {
                return this.ClientDiv.style.margin;
            }
            else
                return ctrl.VisualElement.style.margin;
        },

        set: function (v) {

            
            if (this.ClientDiv != null) {
                this.ClientDiv.style.margin = v;
            }
            else
                ctrl.VisualElement.style.margin = v;

            ctrl.OnPropertyChanged("Margin", v);
        }
    });


    Object.defineProperty(ctrl, "HorizonScrollbar", {
        get: function () {
            if (this.ClientDiv != null) {
                return this.ClientDiv.style.overflowX;
            }
            else
                return ctrl.VisualElement.style.overflowX;
        },

        set: function (v) {


            if (this.ClientDiv != null) {
                this.ClientDiv.style.overflowX = v;
            }
            else
                ctrl.VisualElement.style.overflowX = v;

            ctrl.OnPropertyChanged("HorizonScrollbar", v);

        }
    });

    Object.defineProperty(ctrl, "VerticalScrollbar", {
        get: function () {
            if (this.ClientDiv != null) {
                return this.ClientDiv.style.overflowY;
            }
            else
                return ctrl.VisualElement.style.overflowY;
        },

        set: function (v) {

            
            if (this.ClientDiv != null) {
                this.ClientDiv.style.overflowY = v;
            }
            else
                ctrl.VisualElement.style.overflowY = v;

            ctrl.OnPropertyChanged("VerticalScrollbar", v);
        }
    });

    Object.defineProperty(ctrl, "ScrollStyle", {
        get: function () {
            if (this.ClientDiv != null) {
                return this.ClientDiv.style.overflow;
            }
            else
                return ctrl.VisualElement.style.overflow;
        },

        set: function (v) {

            if (v == null || v == undefined)
                return;

            if (this.ClientDiv != null) {
                this.ClientDiv.style.overflow = v;
                
            }
            else
                ctrl.VisualElement.style.overflow = v;

            ctrl.OnPropertyChanged("ScrollStyle", v);

        }
    });

    Object.defineProperty(ctrl, "Opacity", {
        get: function ()
        { return ctrl.VisualElement.style.opacity; },

        set: function (v) {

            ctrl.SetOpacity(v);
            ctrl.OnPropertyChanged("Opacity", v);
        }
    });

    Object.defineProperty(ctrl, "Bottom", {
        get: function ()
        { return ctrl.VisualElement.style.bottom; },

        set: function (v) {

            if (v == undefined || v == null)
                return;

            this.VisualElement.style.bottom = v;
            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.bottom = v;
            }

            if (ctrl.bottom != v) {
                ctrl.bottom = v;
                ctrl.OnPropertyChanged("Bottom", v);
            }
        }
    });

    Object.defineProperty(ctrl, "Right", {
        get: function ()
        { return ctrl.VisualElement.style.right; },

        set: function (v) {

            if (v == undefined || v == null)
                return;

            this.VisualElement.style.right = v;
            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.right = v;
            }

            if (ctrl.right != v) {
                ctrl.right = v;
                ctrl.OnPropertyChanged("Right", v);
            }

        }
    });

    
    Object.defineProperty(ctrl, "FontSize", {
        get: function ()
        { return ctrl.VisualElement.style.fontSize; },

        set: function (v) {

            
            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.fontSize = v;
            }
            else
                this.VisualElement.style.fontSize = v;
          
            ctrl.SetFontSize(v);

            ctrl.OnPropertyChanged("FontSize", v);
        }
    });

    ctrl.SetFontSize = function (v) {

    }


    Object.defineProperty(ctrl, "FontFamily", {
        get: function ()
        { return ctrl.VisualElement.style.fontFamily; },

        set: function (v) {

            
            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.fontFamily = v;
            }
            else
                this.VisualElement.style.fontFamily = v;

            ctrl.SetFontFamily(v);

            ctrl.OnPropertyChanged("FontFamily", v);
        }
    });

    ctrl.SetFontFamily = function (v) {

    }

    Object.defineProperty(ctrl, "FontStyle", {
        get: function ()
        { return ctrl.fontStyle; },

        set: function (v) {


            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.fontWeight = v;
            }
            else
                this.VisualElement.style.fontWeight = v;

            ctrl.SetFontStyle(v);
            ctrl.fontStyle = v;
            ctrl.OnPropertyChanged("FontStyle", v);
        }
    });

    ctrl.SetFontStyle = function (v) {

    }

    Object.defineProperty(ctrl, "Position", {
        get: function ()
        { return ctrl.VisualElement.style.position; },

        set: function (v) {

            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.position = v;
            }
            else
                this.VisualElement.style.position = v;

            if (ctrl.position != v) {
                ctrl.position = v;
                ctrl.OnPropertyChanged("Position", v);
            }
        }
    });


    Object.defineProperty(ctrl, "Padding", {
        get: function ()
        {
            return ctrl.GetPadding();

        },

        set: function (v) {

            ctrl.SetPadding(v);


        }
    });

    ctrl.GetPadding = function () {
        return ctrl.VisualElement.style.padding;
    }

    ctrl.SetPadding = function (v) {

        if (this.ClientDiv != null) {
            this.ClientDiv.style.padding = v;
        }
        else
            ctrl.VisualElement.style.padding = v;

    }

    Object.defineProperty(ctrl, "Draggable", {
        get: function ()
        { return ctrl.draggable; },

        set: function (v) {

            if (v == "true")
                v = true;
            ctrl.draggable = v;
            ctrl.VisualElement.draggable = v;
            if (ctrl.SetDragable != undefined)
                ctrl.SetDragable(v);

            ctrl.OnPropertyChanged("Draggable", v);
        }
    });

    Object.defineProperty(ctrl, "AllowDrop", {
        get: function ()
        { return ctrl.VisualElement.allowDrop; },

        set: function (v) {

            ctrl.VisualElement.allowDrop = v;
            ctrl.OnPropertyChanged("AllowDrop", v);
        }
    });


    Object.defineProperty(ctrl, "BackgroundColor", {
        get: function ()
        {
            return ctrl.backgroundColor;
        },

        set: function (v) {

            ctrl.backgroundColor = v;
            ctrl.SetBackgroundColor(v);

        }
    });

    ctrl.SetBackgroundColor = function (v) {

        if (ctrl.ClientDiv != null) {
            ctrl.ClientDiv.style.backgroundColor = v;
        }
        else
            ctrl.VisualElement.style.backgroundColor = v;

        ctrl.OnPropertyChanged("BackgroundColor", v);
    }

    ctrl.bkimgurl = "";
    Object.defineProperty(ctrl, "BackgroundImageUrl", {
        get: function ()
        { return ctrl.bkimgurl; },
        set: function (v) {

            ctrl.bkimgurl = v;
            ctrl.SetBackgroundImageUrl(v);

        }
    });

    ctrl.SetBackgroundImageUrl = function (v) {

        if (ctrl.ClientDiv != null) {
            ctrl.ClientDiv.style.backgroundImage = v ;
        }
        else
            ctrl.VisualElement.style.backgroundImage = v ;

            ctrl.OnPropertyChanged("BackgroundImageUrl", v);
    }

    ctrl.bkimgsmode = "";
    Object.defineProperty(ctrl, "BackgroundSizeMode", {
        get: function ()
        {
            return ctrl.bkimgsmode;
        },
        set: function (v) {
            ctrl.bkimgsmode = v;
            ctrl.SetBackgroundSizeMode(v);

        }
    });

    ctrl.SetBackgroundSizeMode = function (v) {

        if (ctrl.ClientDiv != null) {
            ctrl.ClientDiv.style.backgroundSize = v;
        }
        else
            ctrl.VisualElement.style.backgroundSize = v;

        ctrl.OnPropertyChanged("BackgroundSizeMode", v);
    }



    Object.defineProperty(ctrl, "Color", {
        get: function ()
        { return ctrl.VisualElement.style.color; },

        set: function (v) {

            this.VisualElement.style.color = v;

            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.color = v;
            }

            ctrl.SetColor(v);
            ctrl.OnPropertyChanged("Color", v);
        }
    });

    ctrl.SetColor = function (v) {

    }


    Object.defineProperty(ctrl, "Display", {
        get: function ()
        {
            if (ctrl.display == undefined)
                ctrl.display = ctrl.VisualElement.style.display;

            return ctrl.display;
        },

        set: function (v) {

            ctrl.SetDisplay(v);
            if (ctrl.display != v) {
                ctrl.display = v;
                ctrl.OnPropertyChanged("Display", v);
            }
        }
    });

    ctrl.enabled = true;
    Object.defineProperty(ctrl, "Enabled", {
        get: function ()
        { return ctrl.enabled; },

        set: function (v) {

            if (v == undefined || v == null || v.toString().toLowerCase() == "true")
                v = true;
            else
                v = false;

            ctrl.enabled = v;
            ctrl.SetEnabled(v);
            ctrl.OnPropertyChanged("Enabled", v);
            

        }
    });

    //
    ctrl.SetEnabled = function (v) {

        if (v)
            ctrl.VisualElement.disabled = "";
        else
            ctrl.VisualElement.disabled = "disabled";

    }

    //设置可用性表达式
    Object.defineProperty(ctrl, "EnabledExpression", {
        get: function () {
            return ctrl.enabledExpression;
        },
        set: function (v) {

            ctrl.enabledExpression = v;


        }
    });

    ctrl.ComputeEnabledExpression = function () {

        try {
            var expr = ctrl.enabledExpression;
            if (expr != undefined && expr != "") {
                expr = expr.replace("%26%26", "&&").replace("%60", "<");
                var r = eval(expr);
                if (typeof r == "boolean")
                    ctrl.Enabled = r;
            }
        }
        catch (ex) { }

    }

    ctrl.visibled = true;
    Object.defineProperty(ctrl, "Visibled", {
        get: function ()
        {
            return ctrl.visibled;
        },

        set: function (v) {

            if (v == undefined || v == null || v.toString().toLowerCase() == "true")
                v = true;
            else
                v = false;

            ctrl.visibled = v;
            ctrl.SetVisibled(v);
            ctrl.OnPropertyChanged("Visibled", v);
        }
    });

    ctrl.SetVisibled = function (v) {

        if (ctrl.DesignTime)
            return;

        if (v)
            ctrl.VisualElement.style.display = ctrl.Display;
        else
            ctrl.VisualElement.style.display = "none";

    }

    Object.defineProperty(ctrl, "DataBindings", {
        get: function ()
        { return ctrl.dataBindings; },

        set: function (v) {

            ctrl.dataBindings = v;
            ctrl.OnPropertyChanged("DataBindings", v);

        }
    });


    Object.defineProperty(ctrl, "Class", {
        get: function ()
        { return ctrl.ClientDiv.className; },

        set: function (v) {

            if (ctrl.ClientDiv != undefined && ctrl.ClientDiv != null)
                ctrl.ClientDiv.className = v;
            ctrl.OnPropertyChanged("Class", v);
        }
    });

    Object.defineProperty(ctrl, "Dock", {
        get: function () {
            return ctrl.dock;
        },
        set: function (v) {

            ctrl.dock = v;
            ctrl.OnPropertyChanged("Dock", v);
        }
    });

    Object.defineProperty(ctrl, "Name", {
        get: function ()
        { return ctrl.GetName(); },

        set: function (v) {

            if (v != undefined && v != null) {

                if (ctrl.FormContext != undefined)
                    if (v != undefined && v != null && v != "")
                        ctrl.FormContext.Form.FormControls[v] = ctrl;
                    else
                        if (ctrl.name != undefined && ctrl.name != null && ctrl.name != "")
                            delete ctrl.FormContext.Form.FormControls[ctrl.name];

                ctrl.SetName(v);
                ctrl.OnPropertyChanged("Name", v);
            }

        }
    });



    Object.defineProperty(ctrl, "DesignTime", {
        get: function () {
            return ctrl.designTime;

        },
        set: function (v) {

            ctrl.designTime = v;

            ctrl.SetDesignTime(v);

            ctrl.OnPropertyChanged("DesignTime", v);
        }
    }
    );

    Object.defineProperty(ctrl, "Align", {
        get: function () {

            return ctrl.align;
            
        },
        set: function (v) {
            ctrl.align = v;
            if (ctrl.display == "flexbox") {

                ctrl.VisualElement.style.justifyContent = v;
            }
            else
                ctrl.VisualElement.style.textAlign = v;

            ctrl.SetAlign(v);
            ctrl.OnPropertyChanged("Align", v);
        }
    });


    Object.defineProperty(ctrl, "VAlign", {
        get: function () {
            return ctrl.valign;
        },
        set: function (v) {
            ctrl.valign = v;
            if (ctrl.display == "flexbox") {

                ctrl.VisualElement.style.alignItems = v;
            }
            else
            {
                ctrl.valign = v;

                var v1 = v;
                if (v == "center")
                    v1 = "middle";

                ctrl.VisualElement.style.verticalAlign = v1;
            }

            ctrl.SetVAlign(v);

            ctrl.OnPropertyChanged("VAlign", v);
        }
    });

    //
    ctrl.SetVAlign = function (v)
    {
    }

    //
    ctrl.SetAlign = function (v) {


    }

    ctrl.SetDesignTime = function (v) {


    }

    ctrl.SetName = function (v) {


        ctrl.name = v;

    }


    ctrl.GetName = function () {

        return ctrl.name;

    }

    ctrl.SetOpacity = function (v) {

        if (ctrl.ClientDiv != null) {
            ctrl.ClientDiv.style.opacity = v;
        }
        else
            this.VisualElement.style.opacity = v;

        
    }

    //数据上下文改变
    ctrl.DataContextChanged = function (e) {

        ctrl.DataBind(e);

        if (ctrl.enabledExpression != undefined && ctrl.enabledExpression != "")
            ctrl.ComputeEnabledExpression();

    }


    //执行数据绑定
    ctrl.DataBind = function (e) {

        if (this.dataBindings != undefined && this.dataBindings != null && this.dataBindings!="") {

            if (this.dataContext != undefined && this.dataContext != null) {
                try{
                    var vdata = null;
                    var cmdline = "vdata=ctrl.dataContext." + this.dataBindings["Path"] + ";";
                    eval(cmdline);
                    this.SetValue(vdata);
                } catch (ex) { }

            }

        }


    }

    

    ctrl.DragDrop = function (sender, e)
    {

    }

    ctrl.OnDrag = function (e)
    {

    }

    ctrl.OnDrop = function (e) {

        if (ctrl.AllowDrop) {
            ctrl.DragDrop(ctrl,e);
        }

    }

    ctrl.OnDragStart = function (e) {

        if (ctrl.DragStart != undefined)
            ctrl.DragStart(ctrl,e);

        else {
            if (ctrl.Draggable == true) {
                e.dataTransfer.effectAllowed = "move";
                DBFX.Web.Controls.Context.DragObject = ctrl;
            }
        }


    }

    ctrl.OnDragEnter = function (e) {
        
    }

    ctrl.OnDragLeave = function (e) {
        if (ctrl.DragLeave != undefined)
            ctrl.DragLeave(ctrl,e);
    }


    ctrl.OnDragOver = function (e) {


        if (ctrl.DragOver != undefined) {
            ctrl.DragOver(ctrl, e);
        }
        else {
            if (ctrl.AllowDrop==true)
                e.preventDefault();
        }


    }

    ctrl.OnDragEnd = function (e) {
        
    }


    ctrl.OnClick = function (e) {

        if (ctrl.Click != null && ctrl.Click!=undefined) {

            if (typeof ctrl.Click == "function") {

                ctrl.Click(e, ctrl);
            }
            else
                if (ctrl.Click.GetType() == "Command") {

                    ctrl.Click.Sender = ctrl;
                    ctrl.Click.Execute();

                }

        }

    }


    ctrl.OnDblClick = function (e) {

        if (ctrl.DblClick != null)
            ctrl.DblClick(e,ctrl);

    }

    ctrl.OnMouseDown = function (e) {

       
        if (ctrl.MouseDown != null)
            ctrl.MouseDown(e);

    }


    ctrl.OnMouseMove = function (e) {

       
        if (ctrl.MouseMove != null)
            ctrl.MouseMove(e);

    }

    ctrl.OnMouseUp = function (e) {

       
        if (ctrl.MouseUp != null)
            ctrl.MouseUp(e);

    }



    ctrl.OnMouseOver = function (e) {

    
        if (ctrl.MouseOver != null) {
            ctrl.MouseOver(e);
            
        }


    }

    ctrl.OnMouseWheel = function (e) {

      
        if (ctrl.MouseWheel != null)
            ctrl.MouseWheel(e);

    }

    ctrl.OnMouseEnter = function (e) {

  
        if (ctrl.MouseEnter != null)
            ctrl.MouseEnter(e);

    }

    ctrl.OnMouseOut = function (e) {
 
        if (ctrl.MouseOut != null)
            ctrl.MouseOut(e);

    }

    ctrl.SetValue = function (v)
    {


    }

    ctrl.GetValue = function ()
    {

    }

    ctrl.SetContent = function (v) {


    }

    ctrl.GetContent = function () {

    }

    ctrl.SetText = function (v) {


    }

    ctrl.GetText = function () {

    }

    ctrl.SetDisplay = function (v) {

        if (v == "flexbox") {

            var ve = ctrl.VisualElement;
            if (ctrl.ClientDiv != null)
                ve = ctrl.ClientDiv;

            ve.style.setProperty("display", "-ms-flexbox");
            ve.style.setProperty("display", "-webkit-flex");

        } else {

            if (ctrl.ClientDiv != null) {
                ctrl.ClientDiv.style.display = v;
            }
            else
                ctrl.VisualElement.style.display = v;
        }
    }

    ctrl.OnContextMenu = function (e) {

        if (ctrl.ContextMenu!=undefined && ctrl.ContextMenu.ShowContextMenu != undefined) {
            var pt = new Object();
            pt.x = e.clientX;
            pt.y = e.clientY;
            ctrl.ContextMenu.FormContext = ctrl.FormContext;
            ctrl.ContextMenu.DataContext = ctrl.DataContext;
            ctrl.ContextMenu.ShowAt(pt);
            e.cancelBubble = true;
            e.preventDefault();

        }

    }

    ctrl.OnKeyDown = function (e) {

        if (ctrl.Keydown != undefined) {

            if (ctrl.Keydown != undefined && ctrl.Keydown.GetType != undefined && ctrl.Keydown.GetType() == "Command") {
                ctrl.Keydown.Sender = ctrl;
                ctrl.Keydown.Execute();
            }

            if (typeof ctrl.Keydown == "function")
                ctrl.Keydown(e);
        }

    }

    ctrl.OnKeypress = function (e) {

        if (ctrl.Keypress != undefined) {

            if (ctrl.Keypress != undefined && ctrl.Keypress.GetType != undefined && ctrl.Keypress.GetType() == "Command") {
                ctrl.Keypress.Sender = ctrl;
                ctrl.Keypress.Execute();
            }

            if (typeof ctrl.Keypress == "function")
                ctrl.Keypress(e);
        }

    }


    ctrl.OnKeyUp = function (e) {

        if (ctrl.Keyup != undefined) {

            if (ctrl.Keyup != undefined && ctrl.Keyup.GetType != undefined && ctrl.Keyup.GetType() == "Command") {
                ctrl.Keyup.Sender = ctrl;
                ctrl.Keyup.Execute();
            }

            if (typeof ctrl.Keyup == "function")
                ctrl.Keyup(e);
        }

    }


    ctrl.ShowContextMenu = function (e) {
        var cmtype=typeof ctrl.ContextMenu;
        if (cmtype== "string") {

            ctrl.ContextMenu = DBFX.Web.Controls.ContextMenu.ContextMenus[ctrl.ContextMenu];

        }

        ctrl.OnContextMenu(e);
    }


    Object.defineProperty(ctrl, "Value", {
        get: function () {

            return ctrl.GetValue();
    },
        set:function(v)
        {

            ctrl.SetValue(v);
            ctrl.OnPropertyChanged("Value", v);

        }

    });

    Object.defineProperty(ctrl, "Text", {
        get: function () {

            return ctrl.GetText();
        },
        set: function (v) {

            ctrl.SetText(v);

            if(ctrl.OnPropertyChanged)
                ctrl.OnPropertyChanged("Text", v);

        }

    });

    Object.defineProperty(ctrl, "Content", {
        get: function () {

            return ctrl.GetContent();
        },
        set: function (v) {
            ctrl.SetContent(v);
            ctrl.OnPropertyChanged("Content", v);
        }

    });


    ctrl.OnLoad = function () {



    }

    ctrl.OnResized = function () {



    }

    ctrl.SetDisabled = function (v) {

        if (ctrl.ClientDiv != undefined && ctrl.ClientDiv != null) {
            if (v)
                ctrl.ClientDiv.disabled = "disabled";
        }
        else {
            if (v)
                ctrl.VisualElement.disabled = "disabled";
        }

    }

    ctrl.Validate = function () {

        return true;
    }

    ctrl.SetDataDomain = function (v) {



    }

    ctrl.SetWidth = function (v) {

        ctrl.VisualElement.style.width = v;

        if (ctrl.ClientDiv != null) {
            ctrl.ClientDiv.style.width = v;
        }

    }
    ctrl.SetHeight = function (v) {


        ctrl.VisualElement.style.height = v;
        if (ctrl.ClientDiv != null) {
            ctrl.ClientDiv.style.height = v;

        }


    }

    ctrl.SetBorderRadius = function (v) {

        this.VisualElement.style.borderRadius = v;
        if (ctrl.ClientDiv != null) {
            ctrl.ClientDiv.style.borderRadius = v;
        }

        if (ctrl.borderRadius != v) {

            ctrl.OnPropertyChanged("BorderRadius", v);

        }
    }



    ctrl.Base.SetWidth = ctrl.SetWidth;
    ctrl.Base.SetHeight = ctrl.SetHeight;


    ctrl.ScrollIntoView = function (mode) {

        ctrl.VisualElement.scrollIntoView(mode);

    }


    ctrl.Unload = function () {



    }


    return ctrl;
}

//容器 
DBFX.Web.Controls.Container = function (v) {

    var cnt = new DBFX.Web.Controls.Control(v);
    cnt.ClassDescriptor.Serializer = "DBFX.Serializer.ContainerSerializer";
    cnt.ClassDescriptor.DesignTimePreparer = "DBFX.Design.ContainerDesignTimePreparer";
    cnt.VisualElement = document.createElement("DIV");
    cnt.Controls = new DBFX.Web.Controls.ControlsCollection(cnt);
    cnt.OnCreateHandle();
    cnt.OnCreateHandle = function () {

        cnt.ItemsPanel = cnt.VisualElement;

    }

    //添加控件
    cnt.AddControl = function (c) {


        cnt.Controls.push(c);
        cnt.ItemsPanel.appendChild(c.VisualElement);
        if (c.FormContext == undefined)
            c.FormContext = cnt.FormContext;
        c.DataContext = cnt.DataContext;

    }

    cnt.InsertControl = function (c, tc, pos) {

        var idx = cnt.Controls.indexOf(tc);
        if (idx < 0)
            cnt.AddControl(c);
        else {

            if (pos == undefined || pos == 0) {
                cnt.Controls.splice(idx, 0, c);
                tc.VisualElement.insertAdjacentElement("beforeBegin", c.VisualElement);
            }
            else {

                cnt.Controls.splice(idx + 1, 0, c);
                tc.VisualElement.insertAdjacentElement("afterEnd", c.VisualElement);


            }
            if(c.FormContext==undefined)
                c.FormContext = cnt.FormContext;

            c.DataContext = cnt.DataContext;

        }

    }

    cnt.Remove = function (c) {

        var idx = cnt.Controls.indexOf(c);
        cnt.Controls.splice(idx, 1);
        cnt.ItemsPanel.removeChild(c.VisualElement);
    }

    cnt.AddElement = function (e) {

        cnt.ItemsPanel.appendChild(e);
    }

    cnt.AddHtml = function (s) {

        var e = document.createElement("P");
        e.innerHTML = s;
        cnt.ItemsPanel.appendChild(e);
    }


    cnt.DataBind = function (v) {

        for (var i = 0; i < cnt.Controls.length; i++)
            cnt.Controls[i].DataContext = cnt.dataContext;

    }

    cnt.Clear = function () {
        cnt.Controls = new Array();
        cnt.ItemsPanel.innerHTML = "";
    }


    cnt.Validate = function () {

        var r = true;
        for (var idx = 0; idx < cnt.Controls.length; idx++) {

            if (cnt.Controls[idx].Validate == undefined)
                continue;

            r = cnt.Controls[idx].Validate();
            if (r == false)
                break;

        }

        return r;
    }

    cnt.DesignTime = false;

    cnt.UnLoad = function () {

        cnt.Controls.forEach(function (c) {

            if (c.UnLoad != undefined) {
                if (typeof c.UnLoad == "function")
                    c.UnLoad();

                if (c.UnLoad.GetType() == "Command") {
                    c.UnLoad.Sender = c;
                    c.UnLoad.Execute();
                }

            }


            if (c.UnLoaded != undefined && c.UnLoaded.GetType() == "Command") {
                c.UnLoaded.Sender = c;
                c.UnLoaded.Execute();
            }

        });


        if (cnt.UnLoaded != undefined && cnt.UnLoaded.GetType() == "Command") {
            cnt.UnLoaded.Sender = cnt;
            cnt.UnLoaded.Execute();
        }
    }

    cnt.OnLoad = function () {

        cnt.Controls.forEach(function (c) {

            if (c.OnLoad != undefined) {

                if (typeof c.OnLoad == "function")
                    c.OnLoad();

                if (c.OnLoad.GetType() == "Command") {
                    c.OnLoad.Sender = c;
                    c.OnLoad.Execute();
                }
            }

        });

    }
    return cnt;


}

//初始化设计时支持
DBFX.Design.ContainerDesignTimePreparer = function (cnt, dp) {

    cnt.ItemsPanel.appendChild(dp.VisualElement);
    dp.VisualElement.style.left = "0px";
    dp.VisualElement.style.top = "0px";
    dp.VisualElement.style.bottom = "0px";
    dp.VisualElement.style.right = "0px";


}

//
DBFX.Serializer.ContainerSerializer = function () {

    //反系列化
    this.DeSerialize = function (pc, xe, ns) {

        //系列化子控件
        var xcs = xe.querySelector("controls");
        if (xcs != undefined && xcs != null) {
            for (var i = 0; i < xcs.childNodes.length; i++) {
                var xce = xcs.childNodes[i];
                if (xce.localName != "c")
                    continue;

                //创建对象实例
                var c = DBFX.Serializer.CreateInstance(xce, ns, pc.DesignTime);

                pc.AddControl(c);



                //设计时支持
                if (pc.DesignTime != undefined && pc.DesignTime == true) {

                    pc.DesignView.SetDesignTimeMode(c, pc);

                }


                //反系列化对象
                ControlSerializer.DeSerialize(c, xce, ns);

                if (c.Name != undefined && c.Name != null && c.Name != "")
                    pc.FormContext.Form.FormControls[c.Name] = c;



            }
        }
    }


    //系列化
    this.Serialize = function (pc, xe, ns) {

        var xdoc = xe.ownerDocument;
        //系列化控件集合
        var xcs = xdoc.createElement("controls");
        xe.appendChild(xcs);

        for (var i = 0; i < pc.Controls.length; i++) {

            var cm = pc.Controls[i];
            var cxe = xdoc.createElement("c");
            xcs.appendChild(cxe);

            ControlSerializer.Serialize(cm, cxe, null);

        }



    }


}


//按钮
DBFX.Web.Controls.Button = function (text,cb) {

    var btn = new DBFX.Web.Controls.Control("Button");
    btn.ClassDescriptor.DisplayName = "UI基础控件";
    btn.ClassDescriptor.Description = "为UI提供基础实现";
    btn.ClassDescriptor.Serializer = "DBFX.Serializer.ButtonSerializer";
    btn.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.ButtonDesigner");
    btn.VisualElement = document.createElement("DIV");
    btn.OnCreateHandle();
    btn.Button = null;
    btn.OnCreateHandle = function () {

        btn.VisualElement.className = "CButtonBox";
        btn.VisualElement.innerHTML = "<BUTTON class=\"CButton\"><IMG class=\"Button_Image\" style=\"display:none\"></IMG><SPAN  class=\"Button_Text\" ></SPAN></BUTTON>";
        btn.Button = btn.VisualElement.querySelector("BUTTON.CButton");
        btn.Image = btn.VisualElement.querySelector("IMG.Button_Image");
        btn.Span = btn.VisualElement.querySelector("SPAN.Button_Text");
        btn.Span.innerText = text;
        btn.ClientDiv = btn.VisualElement;

        if (cb != null)
            btn.VisualElement.onclick = cb;
        else
            btn.VisualElement.onclick = btn.OnClick;

    }

    btn.SetFontFamily = function (v) {
        btn.Button.style.fontFamily = v;
    }

    btn.SetFontSize = function (v) {
        btn.Button.style.fontSize = v;
    }

    btn.SetFontStyle = function (v) {
        btn.Button.style.fontStyle = v;
    }
    
    btn.SetContent = function (v) {

        btn.Button.innerHTML = v;
    }

    btn.SetValue = function (v) {

        btn.Span.innerText = v;
    }

    btn.GetValue = function () {
        return btn.Span.innerText;
    }

    btn.SetText = function (v) {

        if (v.indexOf("%") >= 0)
            v=app.EnvironVariables.ParsingToString(v);

        btn.Span.innerText = v;


    }

    btn.GetText = function () {
        return btn.Span.innerText;
    }

    btn.OnClick = function (e) {

        if (btn.enabled) {
            if (btn.Command != undefined && btn.Command != null) {
                btn.Command.Sender = btn;
                btn.Command.Execute();
            }

            if (btn.Click != undefined && btn.Click.GetType() == "Command") {

                btn.Click.Sender = btn;
                btn.Click.Execute();
            }
           

            if (btn.Click != undefined && btn.Click.GetType() == "function") {

                btn.Click(e, btn);

            }
        }

    }

    btn.SetDragable = function (v) {

        btn.Button.draggable = v;

    }

    Object.defineProperty(btn, "ImageUrl", {
        get: function () {

            return btn.Image.src;

        },
        set: function (v) {

            if (v != undefined && v != null && v != "") {

                v = v.replace("%currenttheme%", app.CurrentTheme).replace("http://wfs.dbazure.cn","https://wfs.dbazure.cn");

                btn.Image.src = v;
                btn.Image.style.display = "";

            }

        }

    });

    btn.SetWidth = function (v) {

        btn.ClientDiv.style.width = v;

    }

    btn.SetBackgroundColor = function (v) {
        btn.Button.style.backgroundColor = v;
        btn.VisualElement.style.backgroundColor=v;
    }

    btn.SetColor = function (v) {
        btn.Button.style.color = v;
    }
    btn.enabled = true;
    btn.SetEnabled = function (v) {

        btn.enabled = v;

        if (v == false || v == "false") {
            btn.Button.disabled = "disabled";
            btn.VisualElement.disabled="disabled";
            btn.Class = "CButtonBoxdisabled";
            btn.enabled = false;
        }
        else {
            btn.Button.disabled = "";
            btn.VisualElement.disabled = "";
            btn.Class = "CButtonBox";
            btn.enabled = true;
        }

    }

    btn.OnCreateHandle();

    return btn;



}

//文本
DBFX.Web.Controls.TextBox = function (v,b,t,ot) {

    if (ot == undefined)
        ot = "TextBox";
    var tbx = new DBFX.Web.Controls.Control(ot);
    tbx.ClassDescriptor.DisplayName = "TextBox文本输入控件";
    tbx.ClassDescriptor.Description = "为UI提供基础实现";
    tbx.ClassDescriptor.Serializer = "DBFX.Serializer.TextBoxSerializer";
    tbx.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.InputControlDesigner");
    tbx.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.TextBoxDesigner");
    tbx.tipText = "";
    tbx.VisualElement = document.createElement("DIV");
    tbx.OnCreateHandle();
    tbx.VisualElement.className = "TextBox";
    tbx.OnCreateHandle = function () 
    {
        tbx.ClientDiv = tbx.VisualElement;
        tbx.VisualElement.innerHTML = "<DIV class=\"TextBoxDiv\"><IMG  class=\"TextBoxIcon\"></IMG><INPUT type=\"text\" class=\"TextBoxInput\" /><IMG class=\"TextBoxErrImg\" /></DIV>";
        tbx.TextBox = tbx.VisualElement.querySelector("INPUT.TextBoxInput");
        tbx.IconElement = tbx.VisualElement.querySelector("IMG.TextBoxIcon");
        tbx.ErrImage = tbx.VisualElement.querySelector("IMG.TextBoxErrImg");
        tbx.ErrImage.src = "themes/" + app.CurrentTheme + "/images/error.png";
        if(v!=undefined)
            tbx.TextBox.value = v;

        if (t == undefined)
            t = "";

        tbx.TipText=t;

        if (b != undefined)
            tbx.DataBindings = b;

        tbx.TextBox.onchange = tbx.TextChanged;

        tbx.TextBox.onfocus = function (e) {

            tbx.Class = "TextBoxContainerFocus";
            tbx.TextBox.Focusin(e);
        }

        tbx.SetName = function (v) {
            tbx.TextBox.name = v;
        }

        tbx.GetName = function () {
            return tbx.TextBox.name;
        }
        
        tbx.TextBox.onblur = function (e) {
            tbx.Class = "TextBox";
            tbx.TextBox.Focusout(e);
        }

        tbx.ClientDiv.onmouseup = function (e) {
            tbx.TextBox.focus();
        }

        tbx.TextBox.Focusin = function (e) {

            if (tbx.TextBox.value == tbx.tipText || tbx.TextBox.value==tbx.ErrorTipText) {

                tbx.TextBox.value = "";
                tbx.value = "";

            }
            tbx.TextBox.type = tbx.TextBoxType;
            tbx.TextBox.style.color = "black";
            tbx.ErrImage.style.marginRight = "-20px";
        }

        tbx.TextBox.Focusout = function (e) {
            
            if (!tbx.Validate()) {

                

            }
        }

        tbx.ShowError = function (e) {

            tbx.TextBox.style.color = "red";
            tbx.ErrImage.style.marginRight = "2px";

            var ttext = tbx.tipText;
            if (tbx.ErrorTipText != undefined)
                ttext = tbx.ErrorTipText;

            if (tbx.TextBox.value == "") {
                tbx.TextBox.value = ttext;
                tbx.TextBox.type = "text";
            }
        }

        tbx.ErrImage.onmouseenter = function (e) {

            tbx.ov = tbx.TextBox.value;
            var ttext = tbx.tipText;
            if (tbx.ErrorTipText != undefined)
                ttext = tbx.ErrorTipText;

            tbx.TextBox.value = ttext;

            if (tbx.TextBox.type == "password")
                tbx.TextBox.type = "text";

        }

        tbx.ErrImage.onmouseleave = function (e) {

            tbx.TextBox.value = tbx.ov;
            tbx.value = tbx.ov;
            tbx.TextBox.type = tbx.TextBoxType;

        }

        tbx.TextBoxType = tbx.TextBox.type;

        
    }


    tbx.SetFontFamily = function (v) {
        tbx.TextBox.style.fontFamily = v;
    }

    tbx.SetFontSize = function (v) {
        tbx.TextBox.style.fontSize = v;
    }

    tbx.SetFontStyle = function (v) {
        tbx.TextBox.style.fontStyle = v;
    }


    tbx.value = "";
    tbx.TextChanged = function (e) {

        if (tbx.dataBindings != undefined && tbx.dataContext != undefined && tbx.dataBindings.Path!="") {

            var cmdline = "tbx.dataContext." + tbx.dataBindings.Path + "=tbx.TextBox.value;";
            eval(cmdline);

        }


        tbx.RegisterFormContext();
        tbx.value = tbx.TextBox.value;

        if (tbx.TextBox.value == undefined || tbx.TextBox.value == null || tbx.TextBox.value == "") {
            tbx.TextBox.value = tbx.tipText;
            tbx.TextBox.style.color = "lightgray";
            tbx.TextBox.type = "text";
        }
        else {
            tbx.TextBox.style.color = "";
        }


        if (tbx.ValueChanged != undefined) {
            if (tbx.ValueChanged.GetType != undefined && tbx.ValueChanged.GetType() == "Command") {
                tbx.ValueChanged.Sender = tbx;
                tbx.ValueChanged.Execute();

            }
            else
                if(typeof tbx.ValueChanged=="function")
                    tbx.ValueChanged(tbx);
        }

    }

    tbx.RegisterFormContext = function () {
        if (tbx.FormContext != null && tbx.dataProperty != "" && tbx.dataProperty != undefined) {
            if (tbx.dataDomain != undefined && tbx.dataDomain != "") {

                var ddv = tbx.FormContext[tbx.dataDomain];
                if (ddv == undefined)
                    tbx.FormContext[tbx.dataDomain] = new DBFX.DataDomain();

                tbx.FormContext[tbx.dataDomain][tbx.dataProperty] = tbx.TextBox.value;

            }
            else {
                tbx.FormContext[tbx.dataProperty] = tbx.TextBox.value;
            }
        }

        if (tbx.ValueChanged != undefined && tbx.value != tbx.TextBox.value) {
            if (tbx.ValueChanged.GetType != undefined && tbx.ValueChanged.GetType() == "Command") {
                tbx.ValueChanged.Sender = tbx;
                tbx.ValueChanged.Execute();

            }
            else
                tbx.ValueChanged(tbx);
        }

    }

    Object.defineProperty(tbx, "MaxLength", {
        get: function () {
            return tbx.maxLength;
        },
        set: function (v) {
            tbx.maxLength = v;
            tbx.TextBox.maxLength = v;
        }
    });

    Object.defineProperty(tbx, "IconUrl", {
        get: function () {
            return tbx.iconUrl;
        },
        set: function (v) {
            tbx.iconUrl = v;
            tbx.IconElement.src = app.EnvironVariables.ParsingToString(v.replace("%currenttheme%", app.CurrentTheme).replace("http://wfs.dbazure.cn", "https://wfs.dbazure.cn"));
        }
    });

    tbx.SetIconUrl = function (v, w, h) {

        if (v != null && v != undefined)
            v = v.replace("%currenttheme%", app.CurrentTheme);

        tbx.IconElement.src = v;
        if (w != undefined && h != undefined) {

            tbx.IconElement.style.width = w;
            tbx.IconElement.style.height = h;

        }

        if (v != undefined && v != "") {
            tbx.IconElement.style.display = "block";
        }


    }

    tbx.SetValue=function(v)
    {

        if (v == tbx.TextBox.value)
            return;

        if (v != undefined && v != null) {

            tbx.TextBox.value = v;

        }
        else
        {
            tbx.TextBox.value = "";
            v = "";
        }

        tbx.value = v;

        tbx.TextChanged(v);


    }

    tbx.GetValue=function()
    {
        return tbx.value;
    }

    tbx.SetText = function (v) {


        if (v == tbx.TextBox.value)
            return;

        if (v != undefined && v != null) {

            tbx.TextBox.value = v;

        }
        else
            tbx.TextBox.value = "";


        tbx.TextChanged(v);



    }

    tbx.GetText = function () {
        return tbx.TextBox.value;
    }

    tbx.GetValueText = function ()
    {

        return tbx.TextBox.value;

    }
    
    tbx.SetTipText = function (v) {

        if(v==undefined || v==null)
            v="";

        tbx.tipText = v;
        if (tbx.TextBox.value == undefined || tbx.TextBox.value == null || tbx.TextBox.value == "") {
            tbx.TextBox.value = v;
            tbx.TextBox.type = "text";
        }
        
    }

    tbx.SetDisabled = function (v) {

        if(v)
            tbx.TextBox.disabled = "disabled";
    }

    Object.defineProperty(tbx, "TipText", {
        get: function () {
            return tbx.tipText;
        },
        set: function (v) {
            tbx.SetTipText(v);
        }
    });

    //定义验证规则属性
    Object.defineProperty(tbx, "CheckRule", {
        get: function () {
            return tbx.checkRule;

        },
        set: function (v) {
            tbx.checkRule = v;
            if (v != null && v != undefined && v!="") {
                //tbx.TextBox.style.color = "rgba(255,0,0,0.3)";
            }
        }
    });

    tbx.readonly = false;
    Object.defineProperty(tbx, "ReadOnly", {
        get: function () {
            return tbx.readonly;

        },
        set: function (v) {

            tbx.readonly = v;
            if (v != null && v != undefined && (v==true || v == "true"))
                tbx.readonly = true;
            else
                tbx.readonly = false;

            tbx.TextBox.readOnly = tbx.readonly;

        }
    });

    //验证数据是否合法
    tbx.Validate = function () {

        if (tbx.Value == tbx.TipText)
            tbx.Value = "";
        
        var r = true;
        try{
            if (tbx.checkRule != undefined) {

                var crule = tbx.checkRule.replace("Length", "tbx.Value.length").replace("ICD", "tbx.Value.length==18").replace("MPhoneID", "tbx.Value.length==11");
                if (crule == "123.00") {
                    
                    r = (Math.abs(tbx.Value * 1) >= 0);

                }
                else {
                    crule = "r=(" + crule + ");";
                    r = eval(crule);
                }
                
            }
        }
        catch (ex) {
            r = false;
        }

        if (r == false) {
            tbx.ShowError(r);
        }

        return r;
    }

    tbx.SetDataProperty = function (v) {

        tbx.RegisterFormContext();

    }

    tbx.SetFocus = function () {
        tbx.VisualElement.focus();
    }

    tbx.SetColor = function (v) {
        tbx.TextBox.style.color = v;
    }

    tbx.SetFocus = function () {
        tbx.TextBox.focus();
    }


    tbx.OnCreateHandle();
    return tbx;

}

//
DBFX.Design.ControlDesigners.TextBoxDesigner = function () {

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {


        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/TextBoxDesigner.scrp", function (od) {

            od.DataContext = obdc.dataContext;

        }, obdc);


    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "输入框设置";
    return obdc;

}

//
DBFX.Web.Controls.TextArea = function (v, b, t) {

    var ta = new DBFX.Web.Controls.Control("TextArea");
    ta.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.InputControlDesigner");
    ta.OnCreateHandle();
    ta.VisualElement.className = "TextArea";
    ta.OnCreateHandle = function () {

        ta.VisualElement.innerHTML = "<DIV class=\"TextAreaDIV\" ><TEXTAREA class=\"TextAreaInput\" ></TEXTAREA></DIV>";
        ta.ClientDiv = ta.VisualElement;// 
        ta.TextArea = ta.VisualElement.querySelector("TEXTAREA.TextAreaInput");
        ta.TextArea.onchange = ta.TextChanged;
        ta.TextArea.onfocus = function (e) {

            ta.VisualElement.className = "TextAreaSelected";

        }

        ta.TextArea.onblur = function (e) {

            ta.VisualElement.className = "TextArea";
        }
    }

    ta.readonly = false;
    Object.defineProperty(ta, "ReadOnly", {
        get: function () {

            return ta.readonly;

        },
        set: function (v) {


            if (v != undefined && v != null && v != "" && (v == true || v == "true"))
                v = true;
            else
                v = false;

            ta.readonly = v;

            if (v ==true)
                ta.TextArea.readOnly = v;

        }
    });


    ta.SetColor = function (v) {
        ta.TextArea.style.color = v;
    }

    ta.SetFontFamily = function (v) {
        ta.TextArea.style.fontFamily = v;
    }

    ta.SetFontSize = function (v) {
        ta.TextArea.style.fontSize = v;
    }

    ta.SetFontStyle = function (v) {
        ta.TextArea.style.fontStyle = v;
    }

    ta.TextChanged = function (e) {

        if (ta.dataBindings != undefined && ta.dataContext != undefined) {

            var cmdline = "ta.dataContext." + ta.dataBindings.Path + "=ta.TextArea.value ;";
            eval(cmdline);
        }

        if (ta.FormContext != null && ta.dataProperty != "" && ta.dataProperty != undefined) {

            if (ta.dataDomain != undefined && ta.dataDomain != "") {

                var ddv = ta.FormContext[ta.dataDomain];
                if (ddv == undefined)
                    ta.FormContext[ta.dataDomain] = new DBFX.DataDomain();

                ta.FormContext[ta.dataDomain][ta.dataProperty] = ta.TextArea.value;

            }
            else {
                ta.FormContext[ta.dataProperty] = ta.TextArea.value;
            }

        }

    }

    ta.SetValue = function (v) {
        if (v == null)
            v = "";
        ta.TextArea.value = v;

        ta.TextChanged(v);
    }

    ta.GetValue = function () {
        return ta.TextArea.value;
    }

    ta.GetText = function () {
        return ta.GetValue();
    }


    ta.SetText = function (v) {
        ta.SetValue(v);
    }

    ta.SetDisabled = function (v) {

        if(v)
            ta.TextArea.disabled = "disabled";

    }

    //验证数据是否合法
    ta.Validate = function () {

        var r = true;
        if (ta.checkRule != undefined) {
            var crule = ta.checkRule.replace("Length", "ta.Value.length");
            crule = "r=(" + crule + ");";

            r = eval(crule);
        }

        return r;
    }


    ta.OnCreateHandle();

    return ta;

}

//
DBFX.Web.Controls.PasswordBox = function (v, b, t) {

    var tbx = new DBFX.Web.Controls.TextBox(v, b, t, "PasswordBox");
    tbx.TextBox.type = "password";
    tbx.TextBoxType = tbx.TextBox.type;

    return tbx;

}

//标签
DBFX.Web.Controls.BreakLine = function () {

    var bl = new DBFX.Web.Controls.Control("BreakLine");
    bl.ClassDescriptor.DesignTimePreparer = "DBFX.Design.BreakLineDesignTimePreparer";
    bl.VisualElement = document.createElement("DIV");
    bl.ClientDiv = bl.VisualElement;
    bl.VisualElement.className = "BreakLine";
    bl.OnCreateHandle();

   
    return bl;

}

//标签
DBFX.Web.Controls.Label = function (v,mg,c) {
    var lbl = new DBFX.Web.Controls.Control("Label");
    lbl.ClassDescriptor.Serializer = "DBFX.Serializer.LabelBoxSerializer";
    lbl.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.LabelControlDesigner");
    lbl.VisualElement = document.createElement("DIV");
    lbl.OnCreateHandle();
    lbl.VisualElement.className = "LabelBorder";
    lbl.OnCreateHandle = function () {

        //lbl.VisualElement.Type = "Label";
        lbl.VisualElement.innerHTML = "<DIV class=\"Label\"><IMG class=\"LabelImage\"><LABEL class=\"LabelText\"><LABEL></DIV>";
        lbl.Span = lbl.VisualElement.querySelector("LABEL");
        lbl.LabelImage = lbl.VisualElement.querySelector("IMG.LabelImage");
        lbl.LP = lbl.VisualElement.querySelector("DIV.Label");
        lbl.Span.innerHTML = v;
        lbl.ClientDiv = lbl.VisualElement;
        
        if(mg!=undefined)
            lbl.Margin = mg;

        if(c!=undefined)
            lbl.Color = c;
    }

    Object.defineProperty(lbl, "ImageUrl", {
        get: function () {
            return lbl.imageUrl;
        },
        set: function (v) {
            lbl.imageUrl = v;
            if(v!=undefined && v!=null && v!=""){
                lbl.LabelImage.src = app.EnvironVariables.ParsingToString(v.replace("%currenttheme%", app.CurrentTheme).replace("http://wfs.dbazure.cn", "https://wfs.dbazure.cn"));
                lbl.LabelImage.style.display = "block";
                lbl.LP.style.height = "100%";
            }
            else
            {
                lbl.LabelImage.style.display = "none";
                lbl.LP.style.height = "auto";
            }
            
        }
    });

    lbl.value = "";
    lbl.SetValue = function (v) {

        if (!lbl.DesignTime) {
            if (typeof v=="string" && v.indexOf("%") >= 0)
                v = app.EnvironVariables.ParsingToString(v);


            if (lbl.FormContext != null && lbl.dataProperty != "" && lbl.dataProperty != undefined)
                lbl.FormContext[lbl.dataProperty] = v;
        }

        var tval = v;
        if (tval != undefined &&  lbl.dataBindings != undefined && lbl.dataBindings.Format != undefined && lbl.dataBindings.Format != "") {

            tval = tval.ToString(lbl.dataBindings.Format);

        }

        if (v == undefined)
            lbl.Span.innerText = "--";
        else
            lbl.Span.innerText = tval;

        lbl.value = v;
    }

    lbl.GetValue = function () {
        return lbl.value;
    }

    lbl.SetContent = function (v) {

        lbl.Span.innerHTML = v;
    }

    lbl.GetContent = function () {
        return lbl.Span.innerHTML;
    }


    lbl.SetText = function (v) {
        if (!lbl.DesignTime) {
            if (typeof v == "string" && v.indexOf("%") >= 0)
                v = app.EnvironVariables.ParsingToString(v);


            if (lbl.FormContext != null && lbl.dataProperty != "" && lbl.dataProperty != undefined)
                lbl.FormContext[lbl.dataProperty] = v;
        }

        var tval = v;
        if (tval!=undefined && lbl.dataBindings != undefined && lbl.dataBindings.Format != undefined) {

            tval = tval.ToString(lbl.dataBindings.Format);

        }

        if (v == undefined)
            lbl.Span.innerText = "--";
        else
            lbl.Span.innerText = tval;

        lbl.value = v;
    }

    lbl.GetText = function () {
        return lbl.value;
    }

    lbl.SetHeight = function (v) {

        lbl.VisualElement.style.height = v;
        lbl.LabelImage.style.height = "calc(100% - 4px)";
    }

    lbl.SetFontStyle = function (v) {

        lbl.Span.style.fontWeight = v;

    }

    lbl.OnClick = function (e) {

        if (lbl.Click != undefined) {
            if (lbl.Click.GetType != undefined && lbl.Click.GetType() == "Command") {
                lbl.Click.Sender = lbl;
                lbl.Click.Execute();
            }

            if (typeof (lbl.Click) == "function")
                lbl.Click(e);

        }
    }


    lbl.OnCreateHandle();

    return lbl;
}

//文本块
DBFX.Web.Controls.TextBlock = function (v,mg,c) {

    var tb = new DBFX.Web.Controls.Control("TextBlock");
    tb.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.InputControlDesigner");
    tb.OnCreateHandle();
    tb.Class = "TextBlock";
    tb.OnCreateHandle = function () {

        tb.VisualElement.innerHTML = "<SPAN class=\"TextBlockSpan\"/>";
        tb.Paragraph = tb.VisualElement.querySelector("SPAN.TextBlockSpan");
        tb.Paragraph.innerHTML = v;
        tb.ClientDiv = tb.VisualElement;
        tb.Span = tb.Paragraph;
        if(mg!=undefined)
            tb.VisualElement.style.margin = mg;

        if(c!=undefined)
            tb.VisualElement.style.color = c;
    }


    

    tb.SetValue = function (v) {
        tb.Span.innerText = v;
        if (tb.FormContext != null && tb.dataProperty != "" && tb.dataProperty != undefined)
            tb.FormContext[tb.dataProperty] = v;
    }

    tb.GetValue = function () {
        return tb.Span.innerText;
    }


    tb.SetText = function (v) {
        tb.Span.innerText = v;
        if (tb.FormContext != null && tb.dataProperty != "" && tb.dataProperty != undefined)
            tb.FormContext[tb.dataProperty] = v;
    }

    tb.GetText = function () {
        return tb.Span.innerText;
    }

    tb.OnCreateHandle();

    return tb;

}

//滑块
DBFX.Web.Controls.Silder = function (v,min,max) {

    var sld = new DBFX.Web.Controls.Control("Silder");
    sld.ClassDescriptor.Serializer = "DBFX.Serializer.SilderSerializer";
    sld.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.InputControlDesigner");
    
    sld.OnCreateHandle();
    sld.OnCreateHandle = function () {
        sld.Class = "Slider";
        sld.VisualElement.innerHTML = "<INPUT type=\"range\" class=\"SliderInput\"/>";
        sld.RangeSilder = sld.VisualElement.querySelector("INPUT");
        sld.RangeSilder.value = v;
        if (min == undefined || min == null)
            min = 0;

        sld.RangeSilder.min = min;

        if (max == undefined || max == null)
            max = 100;

        sld.RangeSilder.max = max;

        sld.RangeSilder.onchange = sld.OnValueChanged;

    }

    Object.defineProperty(sld, "Max", {
        get: function () {
            return sld.RangeSilder.max;
        }, set: function (v) {

            sld.RangeSilder.max = v;
        }
    });

    Object.defineProperty(sld, "Min", {
        get: function () {
            return sld.RangeSilder.min;
        }, set: function (v) {

            sld.RangeSilder.min = v;
        }
    });

    Object.defineProperty(sld, "Step", {
        get: function () {
            return sld.RangeSilder.step;
        }, set: function (v) {

            sld.RangeSilder.step = v;
        }
    });

    sld.OnValueChanged = function () {

        if (sld.dataBindings != undefined && sld.dataContext != undefined) {

            var cmdline = "sld.dataContext." + sld.dataBindings.Path + "=sld.RangeSilder.value ;";
            eval(cmdline);


        }

        if (sld.FormContext != null && sld.dataProperty != "")
            sld.FormContext[sld.dataProperty] = sld.RangeSilder.value;

        if (sld.ValueChanged != undefined && sld.value != sld.RangeSilder.value) {
            if (sld.ValueChanged.GetType != undefined && sld.ValueChanged.GetType() == "Command") {
                sld.ValueChanged.Sender = sld;
                sld.ValueChanged.Execute();

            }
            else
                sld.ValueChanged(sld);
        }


    }

    sld.ValueChanged = function (c, v) { }


    sld.SetValue = function (v) {
        sld.RangeSilder.value = v;
    }

    sld.GetValue = function () {
        return sld.RangeSilder.value;
    }

    sld.OnCreateHandle();
    return sld;
}

//进度条
DBFX.Web.Controls.ProgressBar = function (v,min,max) {

    var pgb = new DBFX.Web.Controls.Control("ProgressBar");

    pgb.VisualElement = document.createElement("DIV");
    
    pgb.OnCreateHandle();
    //创建呈现句柄
    pgb.OnCreateHandle = function () {
        pgb.Class = "ProgressBar";
        pgb.VisualElement.innerHTML = "<PROGRESS class=\"ProgressBar_Progress\"/>";
        pgb.ProgressBar = this.VisualElement.querySelector("PROGRESS");


        if (min == undefined || min == null)
            min = 0;

        pgb.ProgressBar.min = min;

        if (max == undefined || max == null)
            max = 100;

        pgb.ProgressBar.max = max;

        pgb.ProgressBar.value = v;

        pgb.ProgressBar.onchange = pgb.OnValueChanged;

    }

    Object.defineProperty(pgb, "Min", {
        get: function () {
            return pgb.min;
        },
        set: function (v) {
            pgb.min = v;
            pgb.ProgressBar.min = v;
        }
    });


    Object.defineProperty(pgb, "Max", {
        get: function () {
            return pgb.min;
        },
        set: function (v) {
            pgb.min = v;
            pgb.ProgressBar.min = v;
        }
    });


    pgb.OnValueChanged = function () {

        if (pgb.dataBindings != undefined && pgb.dataContext != undefined) {

            var cmdline = "pgb.dataContext." + pgb.dataBindings.Path + "=pgb.ProgressBar.value;";
            eval(cmdline);

        }


        if (pgb.dataDomain != undefined && pgb.dataDomain != "") {

            var ddv = pgb.FormContext[pgb.dataDomain];
            if (ddv == undefined)
                pgb.FormContext[pgb.dataDomain] = new DBFX.DataDomain();

            pgb.FormContext[pgb.dataDomain][pgb.dataProperty] = pgb.RangeSilder.value;

        }
        else {
            pgb.FormContext[pgb.dataProperty] = pgb.RangeSilder.value;
        }


        if (pgb.ValueChanged != undefined && pgb.value != pgb.RangeSilder.value) {
            if (pgb.ValueChanged.GetType != undefined && pgb.ValueChanged.GetType() == "Command") {
                pgb.ValueChanged.Sender = pgb;
                pgb.ValueChanged.Execute();

            }
            else
                pgb.ValueChanged(pgb);
        }


    }


    pgb.SetValue = function (v) {
        pgb.ProgressBar.value = v;
    }

    pgb.GetValue = function () {
        return pgb.ProgressBar.value;
    }
    pgb.OnCreateHandle();
    return pgb;

}

//复选项
DBFX.Web.Controls.CheckedBox = function (v,t,mg)
{
    var chk = new DBFX.Web.Controls.Control("CheckedBox");
    chk.ClassDescriptor.Serializer = "DBFX.Serializer.CheckedBoxSerializer";
    chk.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.InputControlDesigner");
    chk.VisualElement = document.createElement("DIV");
    chk.OnCreateHandle();
    chk.VisualElement.className = "CheckedBox";
    chk.OnCreateHandle = function () {
        chk.VisualElement.innerHTML = "<INPUT type=\"checkbox\" class=\"CheckedBoxInput\" /><SPAN class=\"CheckedBoxLabel\"></SPAN>";
        chk.ClientDiv = chk.VisualElement;
        chk.CheckBox = chk.VisualElement.querySelector("INPUT.CheckedBoxInput");
        chk.CheckBox.checked = v; 
        chk.Label = chk.VisualElement.querySelector("SPAN.CheckedBoxLabel");
        chk.Label.innerText = t;
        if(mg!=undefined)
            chk.Margin = mg;

        chk.CheckBox.onchange = chk.OnValueChanged;
        chk.Click = function (e) {

            //e.cancelBubble = true;
            if (e.srcElement != chk.CheckBox) {
                chk.CheckBox.checked = !chk.CheckBox.checked;
                chk.OnValueChanged(e);
            }

        }
    }

    chk.OnValueChanged = function (e) {

        e.cancelBubble = true;

        if (chk.dataBindings != undefined && chk.dataContext != undefined) {

            var cmdline = "chk.dataContext." + chk.dataBindings.Path + "=chk.CheckBox.checked;";
            eval(cmdline);
        }

        if (chk.dataDomain != undefined && chk.dataDomain != "") {

            var ddv = chk.FormContext[chk.dataDomain];
            if (ddv == undefined)
                chk.FormContext[chk.dataDomain] = new DBFX.DataDomain();

            chk.FormContext[chk.dataDomain][chk.dataProperty] = chk.CheckBox.checked;

        }
        else {
            chk.FormContext[chk.dataProperty] = chk.CheckBox.checked;
        }


        if (chk.ValueChanged != undefined && chk.value != chk.CheckBox.checked)
        {

            if (chk.ValueChanged.GetType != undefined && chk.ValueChanged.GetType() == "Command") {
                chk.ValueChanged.Sender = chk;
                chk.ValueChanged.Execute();

            }
            else
                chk.ValueChanged(chk);
        }

        chk.value = chk.CheckBox.checked;

    }


    chk.OnClick = function (e) {


        if (chk.Command != undefined && chk.Command != null) {
            chk.Command.Sender = chk;
            chk.Command.Execute();
        }
    }

    chk.value = true;

    chk.SetValue = function (v) {
        chk.CheckBox.checked = v;
        chk.value = v;
        if (chk.FormContext != null && chk.dataProperty != "")
            chk.FormContext[chk.dataProperty] = chk.CheckBox.value;
    }

    chk.GetValue = function () {
        return chk.CheckBox.checked;
    }

    chk.SetContent = function (v) {
        chk.Label.innerText = v;
    }

    chk.GetContent = function () {
        return chk.Label.innerText;
    }

    chk.SetText = function (v) {
        chk.Label.innerText = v;
    }

    chk.GetText = function () {
        return chk.Label.innerText;
    }

    chk.OnCreateHandle();

    return chk;

}

DBFX.Serializer.CheckedBoxSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {


        DBFX.Serializer.DeSerialProperty("ValueChangedCommand", c, xe);
        c.ValueChanged = DBFX.Serializer.CommandNameToCmd(c.ValueChangedCommand);
        DBFX.Serializer.DeSerializeCommand("ValueChanged", xe, c);

    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        var xdoc = xe.ownerDocument;
        DBFX.Serializer.SerializeCommand("ValueChanged", c.ValueChanged, xe);

    }


}

//单选项
DBFX.Web.Controls.RadioButtonList = function (v, list) {
    var rbt = new DBFX.Web.Controls.Control("RadioButtonList");
    rbt.ClassDescriptor.DisplayName = "单选列表控件";
    rbt.ClassDescriptor.Description = "为UIRadioButtonList提供基础实现";
    rbt.ClassDescriptor.Serializer = "DBFX.Serializer.RadioButtonListBoxSerializer";
    rbt.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.ListBoxDesigner");
    rbt.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.InputControlDesigner");
    rbt.VisualElement = document.createElement("DIV");
    rbt.OnCreateHandle();
    rbt.VisualElement.className = "RadioButtonList";
    rbt.Items = Array();
    rbt.OnCreateHandle = function () {

        rbt.ClientDiv = rbt.VisualElement;
        if (list != undefined && list != null) {

            var items = null;
            var li = "items=" + list + ";";
            eval(li);

            for(var item in items)
            {
                rbt.AddItem(items[item]["k"], items[item]["v"]);
            }

        }

        rbt.groupName ="Group_"+DBFX.GetUniqueNumber();

    }

    //数据源
    Object.defineProperty(rbt, "ItemSource", {
        get: function () {
            return rbt.itemSource;
        },
        set: function (v) {

            rbt.itemSource = v;
            rbt.CreateRadioButtonList();
        }
    });

    rbt.displayMember = "Text";
    //数据源
    Object.defineProperty(rbt, "DisplayMember", {
        get: function () {
            return rbt.displayMember;
        },
        set: function (v) {

            rbt.displayMember = v;

        }
    });


    //数据源
    rbt.valueMember = "Value";
    Object.defineProperty(rbt, "ValueMember", {
        get: function () {
            return rbt.valueMember;
        },
        set: function (v) {

            rbt.valueMember = v;

        }
    });


    //创建单选按钮列表
    rbt.CreateRadioButtonList = function () {

        for (var i = rbt.VisualElement.childNodes.length - 1; i >= 0; i--) {

            var e = rbt.VisualElement.childNodes[i];
            if (e.tagName.toLowerCase() == "rbt")
                rbt.VisualElement.removeChild(e);
            
        }
        
        if (Array.isArray(rbt.itemSource)) {

            rbt.itemSource.forEach(function (item) {

                rbt.AddItem(item[rbt.displayMember], item[rbt.valueMember]);

            });

        }

        if (rbt.intValue != undefined) {

            var ie = rbt.FindItem(rbt.intValue)
            if (ie != undefined) {
                ie.RadioButton.checked = true;
            }
        }

    }

    rbt.AddItem = function (t, v) {

        var ie = document.createElement("RBT");
        ie.Text = t;
        ie.className = "RadioButtonItem";
        ie.innerHTML = "<INPUT type=\"radio\" class=\"RadioButton\" /><SPAN class=\"RadioButtonLabel\">" + t + "</SPAN>";
        ie.children[0].name = rbt.groupName;
        ie.children[0].value = v;
        ie.children[0].ItemElement = ie;
        ie.vaue = v;
        ie.children[0].onchange = function (e)
        {
            rbt.Value = e.srcElement.ItemElement.vaue;
            
        }
        ie.RadioButton = ie.children[0];
        rbt.VisualElement.appendChild(ie);
        rbt.Items.Add(ie);

    }

    rbt.OnValueChanged = function () {


        if (rbt.dataBindings != undefined && rbt.dataContext != undefined) {

            var cmdline = "rbt.dataContext." + rbt.dataBindings.Path + "= rbt.value;";
            eval(cmdline);

        }

        rbt.RegisterFormContext();

    }


    rbt.RegisterFormContext = function () {

        if (rbt.FormContext != null && rbt.dataProperty != "" && rbt.dataProperty != undefined) {
            if (rbt.dataDomain != undefined && rbt.dataDomain != "") {

                var ddv = rbt.FormContext[rbt.dataDomain];
                if (ddv == undefined)
                    rbt.FormContext[rbt.dataDomain] = new DBFX.DataDomain();

                rbt.FormContext[rbt.dataDomain][rbt.dataProperty] = rbt.value;

            }
            else {
                rbt.FormContext[rbt.dataProperty] = rbt.value;
            }
        }

        if (rbt.ValueChanged != undefined && rbt.value!="") {
            if (rbt.ValueChanged.GetType != undefined && rbt.ValueChanged.GetType() == "Command") {
                rbt.ValueChanged.Sender = rbt;
                rbt.ValueChanged.Execute();

            }
            else
                if(typeof rbt.ValueChanged=="function")
                    rbt.ValueChanged(v,rbt);
        }


    }

    rbt.FindItem = function (v) {

        if (!Array.isArray(rbt.Items))
            return;

        var item = undefined;
        for(var i=0;i<rbt.Items.length;i++){
            var ie=rbt.Items[i];
            if (ie.RadioButton.value == v || ie.Text == v) {
                item = ie;
                break;
            }

        }

        return item;

    }

    rbt.intValue = undefined;
    rbt.value = "";
    rbt.SetValue = function (v) {
        
        if (rbt.intValue!=v) {
            rbt.intValue = v;
            var ie = rbt.FindItem(v)
            if (ie != undefined) {
                ie.RadioButton.checked = true;
            }
        }

        if (rbt.value != v) {
            rbt.value = v;
            rbt.OnValueChanged();
        }
    }

    rbt.GetValue = function () {
        return rbt.value;
    }

    rbt.OnCreateHandle();
    return rbt;

}

//下拉列表控件
DBFX.Web.Controls.ComboBox = function (v,list) {

    var cbx = new DBFX.Web.Controls.Control("ComboBox");
    cbx.ClassDescriptor.DisplayName = "UI基础控件";
    cbx.ClassDescriptor.Description = "为UI提供基础实现";
    cbx.ClassDescriptor.Serializer = "DBFX.Serializer.ComboBoxSerializer";
    cbx.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.ListBoxDesigner");
    cbx.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.InputControlDesigner");
    cbx.OnCreateHandle();
    cbx.TextBox = null;
    cbx.SearchButton = null;
    cbx.VisualElement.className = "ComboBox";
    cbx.OnCreateHandle = function () {
        cbx.VisualElement.innerHTML = "<TABLE class=\"ComboBoxTable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><TR><TD style=\"width:1px;\"><IMG class=\"ComboBoxIcon\" src=\"\" /></TD><TD ><INPUT class=\"ComboBoxTextBox\" type=\"text\" /></TD><TD style=\"width:1px;\"><BUTTON class=\"ComboBoxSearchBtn\"><IMG src=\"dbfxui/images/Dropdown.png\" class=\"ComboButtonImage\" /></BUTTON></TD></TR></TABLE>";
        cbx.TextBox = cbx.VisualElement.querySelector("INPUT.ComboBoxTextBox");
        cbx.TextBox.readOnly = "true";
        cbx.mode = 0;
        cbx.SearchButton = cbx.VisualElement.querySelector("BUTTON.ComboBoxSearchBtn");
        cbx.ClientDiv = cbx.VisualElement;
        cbx.IconElement = cbx.VisualElement.querySelector("IMG.ComboBoxIcon");
        cbx.IconElement.src = "Themes/" + app.CurrentTheme + "/Images/empty.png";
        cbx.DropDownImage = cbx.VisualElement.querySelector("IMG.ComboButtonImage");
        cbx.DropDownImage.src = "Themes/" + app.CurrentTheme + "/Images/Dropdown.png";
        cbx.TextBox.onfocus = function (e) {

            cbx.ClientDiv.className = "ComboBoxActived";
            cbx.ShowError(true);

        }
        cbx.TextBox.onblur = function (e) {

            cbx.ClientDiv.className = "ComboBox";
            cbx.FindItem(cbx.TextBox.value);
            cbx.LostFocus(cbx);
            cbx.Validate();

        }
        cbx.SearchButton.onblur = function (e) {

            cbx.ClientDiv.className = "ComboBox";

        }

        cbx.SearchButton.onfocus = function (e) {

            cbx.ClientDiv.className = "ComboBoxActived";
            cbx.ShowError(true);


        }

        cbx.SearchButton.onclick = function (e) {
            e.cancelBubble = true;
            cbx.DropDownList();
        }

        cbx.ListBox.OnMenuItemClick = function (item) {

            cbx.SelectedItem = item;
            

        }

        cbx.ListBox.MenuPadClosed = function (menu) {

            cbx.TextBox.focus();

        }

        cbx.TextBox.onchange = cbx.OnValueChanged;
    }

    cbx.SelectedItemChanged = function (c, item) { }

    cbx.SelectedValueChanged = function (c, v) { }

    cbx.SelectedTextChanged = function (c, v) { }

    cbx.SetColor = function (v) {
        cbx.TextBox.style.color = v;
    }


    cbx.SetFontFamily = function (v) {
        cbx.TextBox.style.fontFamily = v;
        cbx.SearchButton.style.fontFamily = v;
    }

    cbx.SetFontSize = function (v) {
        cbx.TextBox.style.fontSize = v;
        cbx.SearchButton.style.fontSize = v;
    }

    cbx.SetFontStyle = function (v) {
        cbx.TextBox.style.fontStyle = v;
        cbx.SearchButton.style.fontStyle = v;
    }

    cbx.LostFocus = function ()
    { }


    cbx.OnValueChanged = function () {

        if (cbx.dataBindings != undefined && cbx.dataContext != undefined) {

            var cmdline = "cbx.dataContext." + cbx.dataBindings.Path + "=cbx.selectedValue;";
            eval(cmdline);
        }


        cbx.RegisterFormContext();

        cbx.SelectedValueChanged(cbx, cbx.selectedValue);

        if (cbx.ValueChanged != undefined && cbx.ValueChanged.GetType() == "Command") {

            cbx.ValueChanged.Sender = cbx;
            cbx.ValueChanged.Execute();
        }
        else
            if (cbx.ValueChanged != undefined && typeof cbx.ValueChanged == "function") {

                cbx.ValueChanged(cbx.selectedValue, cbx);
            }

    }

    cbx.RegisterFormContext = function () {

        if (cbx.FormContext != null && cbx.dataProperty != "" && cbx.dataProperty != undefined) {
            if (cbx.dataDomain != undefined && cbx.dataDomain != "") {

                var ddv = cbx.FormContext[cbx.dataDomain];
                if (ddv == undefined)
                    cbx.FormContext[cbx.dataDomain] = new DBFX.DataDomain();

                cbx.FormContext[cbx.dataDomain][cbx.dataProperty] = cbx.selectedValue;

                cbx.FormContext[cbx.dataDomain][cbx.dataProperty + "_Text"] = cbx.selectedText;

            }
            else {
                cbx.FormContext[cbx.dataProperty] = cbx.selectedValue;
                cbx.FormContext[cbx.dataProperty + "_Text"] = cbx.selectedText;
            }
        }

        if (cbx.ValueChanged != undefined && cbx.value != cbx.selectedValue.value) {
            if (cbx.ValueChanged.GetType != undefined && cbx.ValueChanged.GetType() == "Command") {
                cbx.ValueChanged.Sender = cbx;
                cbx.ValueChanged.Execute();

            }
            else
                cbx.ValueChanged(cbx);
        }


    }


    //定义验证规则属性
    Object.defineProperty(cbx, "CheckRule", {
        get: function () {
            return cbx.checkRule;

        },
        set: function (v) {
            cbx.checkRule = v;
            if (v != null && v != undefined) {
                cbx.TextBox.style.color = "red";
            }
        }
    });


    //验证数据是否合法
    cbx.Validate = function () {

        var r = true;
        try {

            if (cbx.checkRule != undefined) {

                var crule = cbx.checkRule.replace("this.Value", "this.selectedValue").replace("ICD", "this.selectedValue && this.selectedValue.length==18").replace("MPhoneID", "this.selectedValue && this.selectedValue.length==11").replace("Length", "this.Value.length");
                var s = "";
                crule = "(" + crule+ ")";
                r = eval(crule);
            }
            
        } catch (ex) {

            r = false;

        }
        cbx.ShowError(r);
        return r;

    }

    cbx.ShowError = function (flag) {

        if (flag == false) {
            cbx.TextBox.style.color = "red";
        }
        else
            cbx.TextBox.style.color = "";

    }

    cbx.AddItem = function (t,v,o) {

        var item = new DBFX.Web.Controls.MenuItem(t, "");
        item.Value = v;
        item.DataContext = o;
        cbx.ListBox.AddItem(item);

    }

    cbx.ClearItems = function () {

        cbx.ListBox.ClearItems();

    }

    cbx.displayMember = "Text";
    Object.defineProperty(cbx, "DisplayMember", {
        get: function () {
            return cbx.displayMember;
        },
        set: function (v) {

            cbx.displayMember = v;
        }
    });

    cbx.valueMember = "Value";
    Object.defineProperty(cbx, "ValueMember", {
        get: function () {
            return cbx.valueMember;
        },
        set: function (v) {

            cbx.valueMember = v;
        }
    });


    Object.defineProperty(cbx, "SelectedValue", {
        get: function () {
            return cbx.selectedValue;
        },
        set: function (v) {
            cbx.selectedValue = v;
            cbx.ReSetValue(v);
        }

    });

    cbx.ReSetValue = function (v)
    {

        var ti = cbx.FindItem(v);
        if (ti !== undefined && ti != null) {
            cbx.ListBox.OnMenuItemClick(ti);
        }

    }

    Object.defineProperty(cbx, "SelectedIndex", {
        get: function () {
            return cbx.selectedIndex;
        },
        set: function (v) {
            cbx.selectedIndex = v;
            if (cbx.itemSource != undefined && cbx.itemSource.length > v) {
                var ti=cbx.FindItem(cbx.itemSource[v]);
                if ( ti!= null)
                    cbx.ListBox.OnMenuItemClick(ti);
            }
        }

    });


    Object.defineProperty(cbx, "Mode", {
        get: function () {
            return cbx.mode;
        },
        set: function (v) {
            cbx.mode = v;
            if (v == "0")
                cbx.TextBox.readOnly = "true";
            else
                cbx.TextBox.readOnly = "";

        }
    });


    cbx.FindItem = function (item) {

        var ti = undefined;
        if (!Array.isArray(cbx.ListBox.Items)) {
            cbx.selectedItem = undefined;
            cbx.selectedValue = undefined;
            cbx.selectedText = "";
            cbx.SetText("");
            return null;
        }

        for (var i = 0; i < cbx.ListBox.Items.length; i++) {

            var titem = cbx.ListBox.Items[i];
            if (titem.Text == item || titem.Value == item || titem.dataContext == item) {

                ti = titem;

                break;

            }

        }

        if (ti == undefined) {

            cbx.selectedItem = undefined;
            cbx.selectedValue = undefined;
            cbx.selectedText = item;

        }

        return ti;
    }

    Object.defineProperty(cbx, "SelectedText", {
        get: function () {
            return cbx.selectedText;
        },
        set: function (v) {
            cbx.selectedText = v;
            cbx.ReSetValue(v);
        }

    });


    Object.defineProperty(cbx, "SelectedItem", {
        get: function () {
            return cbx.selectedItem;
        },
        set: function (v) {

            cbx.TextBox.value = v.Text;
            cbx.selectedItem = v;
            cbx.selectedText = v.Text;
            cbx.selectedValue = v.Value;
            cbx.selectedIndex = cbx.itemSource.indexOf(v);

            //只改变
            cbx.OnValueChanged();

            //选定项目改变
            cbx.SelectedItemChanged(cbx, v);

        }

    });
    
    cbx.selectedValue = null;
    cbx.selectedItem = null;
    cbx.selectedText = "";

    cbx.Click = function () {
        if (cbx.TextBox.readOnly)
            cbx.DropDownList();
    }

    cbx.ListBox = new DBFX.Web.Controls.PopupMenu();

    cbx.DropDownList = function () {

        var pt = new Object();
        var rc = cbx.ClientDiv.getBoundingClientRect();
        pt.x = rc.left;
        pt.y = rc.bottom+1;
        pt.w = rc.width - 6;
        pt.t = rc.top - 2;

        cbx.ListBox.ShowMenuAtPoint(pt);

    }

    cbx.SetIconUrl = function (v, w, h) {

        if (v != null && v != undefined) {
            v = v.replace("%currenttheme%", app.CurrentTheme);

            cbx.IconElement.src = v;
        }
        if (w != undefined && h != undefined) {
            cbx.IconElement.style.width = w;
            cbx.IconElement.style.height = h;
            cbx.TextBox.style.top = "-2px";
            var rc = cbx.VisualElement.getBoundingClientRect();

        }

        if (v != undefined && v != "" && v!=null) {

            cbx.IconElement.style.display = "";
        }
        else
            cbx.IconElement.style.display = "none";
    }

    cbx.SetTipText = function (v) {

        cbx.TextBox.value = v;
    }

    Object.defineProperty(cbx, "ItemSource", {
        get:function() {
            return cbx.itemSource;
        },
        set: function (v) {
            cbx.itemSource = v;
            cbx.ReArray();
        }
    });

    //重新排列集合
    cbx.ReArray = function () {

        cbx.ListBox.ClearItems();

        if (cbx.itemSource == undefined || cbx.itemSource == null) {

            return;
        }
        
        if (Array.isArray(cbx.itemSource)) {

            for (var i = 0; i < cbx.itemSource.length; i++) {

                var o = cbx.itemSource[i];
                cbx.AddItem(o[cbx.displayMember],o[cbx.valueMember],o);

            }
        }
        else {

            for (var p in cbx.itemSource) {

                cbx.AddItem(p, cbx.itemSource[p], cbx.itemSource);

            }

        }

        if (cbx.initValue != undefined) {
            var ti = cbx.FindItem(cbx.initValue);
            if (ti !== undefined && ti != null) {
                cbx.ListBox.OnMenuItemClick(ti);
            }
        }
    }

    cbx.initValue = undefined;
    cbx.SetValue = function (v) {
        cbx.initValue = v;

        if(v!=undefined)
            cbx.TextBox.value = v;

        var ti = cbx.FindItem(v);
        if (ti !== undefined && ti!=null) {
            cbx.ListBox.OnMenuItemClick(ti);
        }

    }
    
    cbx.GetValue = function () {

        return cbx.TextBox.value;
    }

    cbx.SetText = function (v) {
        cbx.TextBox.value = v;
    }

    cbx.GetText = function () {
        return cbx.TextBox.value;
    }

    cbx.OnCreateHandle();
    return cbx;

} 

///图片
DBFX.Web.Controls.Image = function (v,w,h)
{
    var img = new DBFX.Web.Controls.Control("Image");
    img.ClassDescriptor.Serializer = "DBFX.Serializer.ImageSerializer";
    img.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.ImageSelectedDesigner");
    img.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.BaseBindingDesigner");
    img.VisualElement = document.createElement("DIV");
    img.OnCreateHandle();
    img.VisualElement.className = "ImageControl";
    img.OnCreateHandle = function () {

        img.VisualElement.innerHTML = "<IMG src=\"\" class=\"Image\" />";
        img.Image = img.VisualElement.querySelector("IMG");
        img.ClientDiv = this.VisualElement;
        if (v != undefined)
            img.ImageUrl = v;

        if (w != undefined)
            img.Width = w;

        if (h != undefined)
            img.Height = h;

    }

    img.SetValue = function (v) {

        if(v!=null)
            img.ImageUrl = v;
    }

    img.SetWidth = function (v) {

        //img.Image.style.width = v;
        img.VisualElement.style.width = v;

    }
    img.SetHeight = function (v) {
        img.VisualElement.style.height = v;
        //img.Image.style.height = v;

    }

    img.SetDisplay = function (v) {

        img.VisualElement.style.display = v;
        //img.Image.style.display = v;

    }



    img.SetDesignTime = function (v) {

        if (v == true) {

            img.Image.style.border = "1px dotted gray";

            img.Image.style.position = "relative";

        }

    }

    img.imageUrl = "";
    Object.defineProperty(img, "ImageUrl", {
        get: function () {
            return img.imageUrl;
        }, set: function (v) {
            try {

                img.imageUrl = v;

                if (v != null && v != undefined)
                    img.Image.src = app.EnvironVariables.ParsingToString(v.replace("%currenttheme%", app.CurrentTheme).replace("http://wfs.dbazure.cn", "https://wfs.dbazure.cn"));

            } catch (ex) { }
        }
    });

    img.OnCreateHandle();
    
    return img;

}

//开关选择
DBFX.Web.Controls.Switch=function(callback,tag){

    var swc = new DBFX.Web.Controls.Control("Switch");
    swc.CallBack = callback;
    swc.Tag = tag
    swc.IsInitialize = true;
    swc.OnClick = function (e) {

        if (swc.value == 0) {
            swc.Value = 1;
        }
        else {
            swc.Value = 0;
        }

        if (swc.CallBack != null)
            swc.CallBack(swc);
        if(!swc.IsInitialize)
            swc.OnValueChanged();

        e.cancelBubble = true;
        swc.IsInitialize = false;

    }

    swc.OnCreateHandle();
    swc.value = 0;
    swc.OnCreateHandle = function () {

        swc.VisualElement.innerHTML = "<DIV class=\"Switch\" ><DIV class=\"SwitchOff\" /></DIV>"
        swc.ButtonDiv = swc.VisualElement.querySelector("DIV.Switch");
        swc.Button = swc.VisualElement.querySelector("DIV.SwitchOff");
    }

    swc.OnValueChanged = function () {

        if (swc.dataBindings != undefined && swc.dataContext != undefined) {

            swc.dataContext[swc.dataBindings.Path] = swc.value;
            var cmdline = "swc.dataContext." + swc.dataBindings.Path + "= swc.value;";
            eval(cmdline);
        }

        if (swc.dataDomain != undefined && swc.dataDomain != "") {

            var ddv = swc.FormContext[swc.dataDomain];
            if (ddv == undefined)
                swc.FormContext[swc.dataDomain] = new DBFX.DataDomain();

            swc.FormContext[swc.dataDomain][swc.dataProperty] = swc.value;

        }
        else {
            swc.FormContext[swc.dataProperty] = swc.value;
        }

        //出发执行值改变事件
        if (swc.ValueChanged != undefined) {
            if (swc.ValueChanged.GetType != undefined && swc.ValueChanged.GetType() == "Command") {
                swc.ValueChanged.Sender = swc;
                swc.ValueChanged.Execute();

            }
            else
                swc.ValueChanged(swc);
        }


    }


    swc.SetValue = function (v) {

        
        if (v == 1) {
            swc.Button.className = "SwitchOn";
            var left = (swc.ButtonDiv.clientWidth - swc.Button.clientWidth-4) + "px";
            swc.Button.style.left = left;
            
        }
        else {

            swc.Button.style.left = "0px";
            swc.Button.className = "SwitchOff";
        }

        if(swc.value!=v && swc.IsInitialize)
            swc.OnValueChanged();

        swc.value = v;

        swc.IsInitialize = false;

    }

    swc.GetValue = function () {
        return swc.value;
    }


    swc.OnCreateHandle();
    return swc;
}

//数值选取
DBFX.Web.Controls.NumberDomain = function () {

    var nmd = new DBFX.Web.Controls.Control("NumberDomain");
    nmd.ClassDescriptor.Serializer = "DBFX.Serializer.NumberDomainSerializer";
    nmd.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.InputControlDesigner");
    nmd.VisualElement = document.createElement("DIV");
    nmd.OnCreateHandle();
    nmd.VisualElement.className = "NumberDomain";
    nmd.prevValue = 0;
    nmd.OnCreateHandle = function () {

        nmd.VisualElement.innerHTML = "<DIV class=\"NumberDomainDiv\"><DIV class=\"NumberDomain_DecreaseDiv\"><IMG class=\"NumberDomain_Decrease\" /></DIV><INPUT type=\"number\" class=\"NumberDomainInput\" /><DIV class=\"NumberDomain_IncreaseDiv\"><IMG class=\"NumberDomain_Increase\" /></DIV></DIV>";
        nmd.NumberDomain = nmd.VisualElement.querySelector("INPUT.NumberDomainInput");;
        //nmd.NumberDomain.onchange = nmd.TextChanged;
        nmd.ClientDiv = nmd.VisualElement;
        nmd.TipLabel = nmd.VisualElement.querySelector("LABEL.InputTipLabel");
        nmd.InImageDiv = nmd.VisualElement.querySelector("DIV.NumberDomain_IncreaseDiv");
        nmd.InImage = nmd.VisualElement.querySelector("IMG.NumberDomain_Increase");
        nmd.InImage.src = "themes/" + app.CurrentTheme + "/images/Increase.png";
        nmd.InImageDiv.onclick = function (e) {

            if (nmd.enabled) {
                var cv = (nmd.Value * 1) + 1;
                if (cv > nmd.max)
                    cv = nmd.max;

                nmd.Value = cv;
            }
            e.cancelBubble = true;
        }

        nmd.DeImageDiv = nmd.VisualElement.querySelector("DIV.NumberDomain_DecreaseDiv");
        nmd.DeImage = nmd.VisualElement.querySelector("IMG.NumberDomain_Decrease");
        nmd.DeImage.src = "themes/" + app.CurrentTheme + "/images/Decrease.png";
        nmd.DeImageDiv.onclick = function (e) {

            if (nmd.enabled) {
                var cv = (nmd.Value * 1) - 1;
                if (cv < nmd.min)
                    cv = nmd.min;

                nmd.Value = cv;
            }

            e.cancelBubble = true;

        }

       
        nmd.NumberDomain.onkeypress = function (e) {

            if (event.keyCode == 13) {
                
                nmd.TextChanged();
            }

        }

        nmd.NumberDomain.onblur = function (e) {

            nmd.TextChanged();
            
        }

    }

    nmd.Click = function (e) {

        e.cancelBubble = true;

    }

    nmd.max=10000;
    Object.defineProperty(nmd,"Max",{
        get:function()
        {
            return nmd.max;
        },
        set:function(v)
        {
            nmd.max=v;
        }
    });

    nmd.min=0;
    Object.defineProperty(nmd,"Min",{
        get:function()
        {
            return nmd.min;
        },
        set:function(v)
        {
            nmd.min=v;
        }
    });

    nmd.SetEnabled = function (v) {

        if (nmd.enabled) {
            nmd.VisualElement.style.opacity = "1";
            nmd.NumberDomain.disabled = "";
        }
        else {
            nmd.VisualElement.style.opacity = "0.6";
            nmd.NumberDomain.disabled = "disabled";
        }

    }

    nmd.SetFontSize = function (v) {
        nmd.NumberDomain.style.fontSize = v;
    }

    nmd.SetFontStyle = function (v) {

        nmd.NumberDomain.style.fontWeight = v;

    }

    nmd.TextChanged = function () {

        if (nmd.NumberDomain.value == nmd.prevValue)
            return;

        if (nmd.dataBindings != undefined && nmd.dataContext != undefined) {

            nmd.dataContext[nmd.dataBindings.Path] = nmd.NumberDomain.value;

        }
        if (nmd.FormContext != null && nmd.dataProperty != "")
            nmd.FormContext[nmd.dataProperty] = nmd.NumberDomain.value;

        if (nmd.ValueChanged != undefined && (nmd.value*1.0!=nmd.NumberDomain.value*1.0)) {
            if (nmd.ValueChanged.GetType != undefined && nmd.ValueChanged.GetType() == "Command") {
                nmd.ValueChanged.Sender = nmd;
                nmd.ValueChanged.Execute();

            }
            else
                nmd.ValueChanged(nmd);
        }

        nmd.value = nmd.NumberDomain.value;
        nmd.prevValue = nmd.value;
    }

    nmd.value = "";

    nmd.SetValue = function (v) {

        var v1 = v * 1;

        if (v1 == NaN)
            v = 0;

        
        nmd.NumberDomain.value = v;
        nmd.TextChanged();
        


    }
    nmd.GetValue = function () {

        var v = nmd.NumberDomain.value * 1;

        if (v == NaN)
            nmd.NumberDomain.value = 0;

        return nmd.NumberDomain.value;

    }

    nmd.SetText = function (v) {
        nmd.prevValue = v;
    }
    nmd.OnCreateHandle();
    return nmd;

}


DBFX.Serializer.NumberDomainSerializer = function () {


    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        DBFX.Serializer.DeSerialProperty("ValueChangedCommand", c, xe);
        c.ValueChanged = DBFX.Serializer.CommandNameToCmd(c.ValueChangedCommand);

        DBFX.Serializer.DeSerializeCommand("ValueChanged", xe, c);

    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        var xdoc = xe.ownerDocument;
        DBFX.Serializer.SerialProperty("ValueChangedCommand", c.ValueChangedCommand, xe);
        DBFX.Serializer.SerializeCommand("ValueChanged", c.ValueChanged, xe);
    }


}


//时间选取器
DBFX.Web.Controls.TimePicker = function () {

    var tpk = new DBFX.Web.Controls.Control("TimePicker");
    tpk.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.InputControlDesigner");
    tpk.OnCreateHandle();
    tpk.VisualElement.className = "TimePicker";
    tpk.OnCreateHandle = function () {

        tpk.VisualElement.innerHTML = "<LABEL  class=\"InputTipLabel\"></LABEL><INPUT type=\"time\" class=\"TimePickerInput\"/>";
        tpk.TimePicker = tpk.VisualElement.querySelector("INPUT.TimePickerInput");
        tpk.TimePicker.readOnly = true;
        tpk.TimePicker.onchange = tpk.ValueChanged;
        tpk.ClientDiv = tpk.VisualElement;
        tpk.TipLabel = tpk.VisualElement.querySelector("LABEL.InputTipLabel");

    }
    tpk.ValueChanged = function () {

        if (tpk.dataBindings != undefined && tpk.dataContext != undefined) {

            tpk.dataContext[tpk.dataBindings.Path] = tpk.TimePicker.value;

        }

        if (tpk.FormContext != null && tpk.dataProperty != "")
            tpk.FormContext[tpk.dataProperty] = tpk.TimePicker.value;
    }

    tpk.SetValue = function (v) {
        tpk.TimePicker.value = v;
    }
    
    tpk.GetValue = function () {

        return tpk.TimePicker.value;
    }



    tpk.OnCreateHandle();
    return tpk;

}

//日期选取器
DBFX.Web.Controls.DatePicker = function () {
    
    var dpk = new DBFX.Web.Controls.Control("DatePicker");
    dpk.ClassDescriptor.DisplayName = "UI基础控件";
    dpk.ClassDescriptor.Description = "为UI提供基础实现";
    dpk.ClassDescriptor.Serializer = "DBFX.Serializer.DatePickerSerializer";
    dpk.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.InputControlDesigner");
    dpk.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.DatePickerDesigner");
    dpk.VisualElement.className = "DatePicker";
    dpk.OnCreateHandle();
    dpk.OnCreateHandle = function () {

        dpk.VisualElement.innerHTML = "<DatePickerDiv class=\"DatePickerDiv\"><LABEL class=\"DatePicker_TipText\"></LABEL><INPUT type=\"text\" class=\"DatePickerInput\" /></INPUT><IMG class=\"DatePickerImage\" /></DIV>";
        dpk.ClientDiv = dpk.VisualElement;
        dpk.DatePicker = dpk.VisualElement.querySelector("INPUT.DatePickerInput");
        dpk.DatePicker.onchange = dpk.ValueChanged;
        dpk.DatePicker.readonly = true;
        dpk.TipLable = dpk.VisualElement.querySelector("LABEL.DatePicker_TipText");
        dpk.Image = dpk.VisualElement.querySelector("IMG.DatePickerImage");
        dpk.Image.src = "themes/" + app.CurrentTheme + "/images/datepicker.png";
        dpk.DatePicker.onfocus = function (e) {

            dpk.ClientDiv.className = "DatePickerFocus";

        }

        dpk.DatePicker.onblur = function (e) {

            dpk.ClientDiv.className = "DatePicker";
        }

        dpk.DatePicker.onkeyup = function (e) {

            if (dpk.DatePicker.value != undefined)
                dpk.TipLable.style.display = "none";

        }

        dpk.DatePicker.onclick = function (e) {

            dpk.ShowCalendar();

        }

        dpk.Image.onclick = function (e) {

            dpk.ShowCalendar();
        }

        dpk.CalendarPad = new DBFX.Web.Controls.PopupPanel();
        dpk.Calendar = new DBFX.Web.Controls.Calendar();
        dpk.CalendarPad.AddControl(dpk.Calendar);
        dpk.CalendarPad.Closed = function (sender) {


        }

        dpk.Calendar.ValueChanged = function (v, calendar) {

            dpk.SetValue(v);


        }

        dpk.Calendar.DateSelected = function (v, flag) {

            if (flag == 1)
                dpk.CalendarPad.Close();

        }

    }

    dpk.ShowCalendar = function () {

        dpk.Calendar.Value = dpk.value;
        dpk.CalendarPad.Show(dpk);
        dpk.CalendarPad.Width = "auto";

    }


    dpk.ValueChanged = function () {

        if(dpk.DatePicker.value!=undefined && dpk.DatePicker.value!="")
            dpk.TipLable.style.display = "none";
        else
            dpk.TipLable.style.display = "";

        if (dpk.dataBindings != undefined && dpk.dataContext != undefined) {

            dpk.dataContext[dpk.dataBindings.Path] = dpk.value;

        }


        dpk.RegisterFormContext();
        
    }

    dpk.RegisterFormContext = function () {
        if (dpk.FormContext != null && dpk.dataProperty != "" && dpk.dataProperty != undefined) {
            if (dpk.dataDomain != undefined && dpk.dataDomain != "") {

                var ddv = dpk.FormContext[dpk.dataDomain];
                if (ddv == undefined)
                    dpk.FormContext[dpk.dataDomain] = new DBFX.DataDomain();

                dpk.FormContext[dpk.dataDomain][dpk.dataProperty] = dpk.value;

            }
            else {
                dpk.FormContext[dpk.dataProperty] = dpk.value;
            }
        }
    }


    dpk.value = new Date();

    dpk.GetValue = function () {
        return dpk.value;
    }

    dpk.SetValue = function (v) {

        try{
            if (typeof v == "string")
                v = new Date(v);

            if (isNaN(v))
                v = new Date();

            if (v == undefined || v == "" || isNaN(new Date(v)))
                v = new Date();

            dpk.SetDateValue(v);
        }
        catch(ex)
        {
            //alert(ex.toString());
        }

    }

    dpk.SetDateValue = function (v) {
        
        var dstr="";
        if (dpk.mode == "0") {

            dstr=(v.getMonth()+1)+"/"+v.getDate()+"/"+v.getFullYear();
            dpk.value = new Date(dstr);
            dpk.DatePicker.value = dpk.value.toLocaleDateString();

        }

        if (dpk.mode == "1") {

            dpk.value = v
            dpk.DatePicker.value = dpk.value.toLocaleDateString() + " " + v.toLocaleTimeString();

        }

        dpk.ValueChanged();

    }

    dpk.SetTipText = function (v) {

        dpk.TipText = v;
        dpk.TipLable.innerText = v;

    }

    dpk.mode = "0";
    Object.defineProperty(dpk, "Mode", {
        get: function () {
            return dpk.mode;
        },
        set: function (v) {
            dpk.mode = v;
            dpk.Calendar.Model = v;
        }
    });

    dpk.UnLoad = function () {

        if(dpk.CalendarPad.IsOpen==true)
            dpk.CalendarPad.Close();

    }

    dpk.OnCreateHandle();
    return dpk;

}

//日历面板
DBFX.Web.Controls.Calendar = function () {

    var calendar = new DBFX.Web.Controls.Control("Calendar");
    calendar.VisualElement = document.createElement("DIV");
    calendar.OnCreateHandle();
    calendar.OnCreateHandle = function () {
        calendar.VisualElement.className = "Calendar";
        calendar.VisualElement.innerHTML = "<DIV class=\"Calendar_YearDiv\"></DIV><DIV class=\"Calendar_MDDiv\"></DIV><DIV class=\"Calendar_TimeDiv\" ></DIV>";
        calendar.MDDiv = calendar.VisualElement.querySelector("DIV.Calendar_MDDiv");
        calendar.DSDiv = calendar.VisualElement.querySelector("DIV.Calendar_YearDiv");
        calendar.TSDiv = calendar.VisualElement.querySelector("DIV.Calendar_TimeDiv");

        var wkdays = ["一", "二", "三", "四", "五", "六", "日"];
        calendar.Table = document.createElement("TABLE");
        calendar.Table.className = "Calendar_Table";
        calendar.Table.cellPadding = "0";
        calendar.Table.cellSpacing = "0";
        for (var i = 0; i < 7; i++) {
            var tr = document.createElement("TR");

            tr.className = "Calendar_MDRow";

            calendar.Table.appendChild(tr);
            for (var j = 0; j < 7; j++) {
                var td = document.createElement("TD");
                td.className = "Calendar_MDTD";
                if (i == 0) {
                    td.innerText = wkdays[j];
                    td.className = "Calendar_MDTH";
                }
                tr.appendChild(td);
            }

        }
        calendar.MDDiv.appendChild(calendar.Table);

        calendar.DSTable = document.createElement("TABLE");
        calendar.DSTable.innerHTML = "<TR><TD class=\"Calendar_DSCell\"><<</TD><TD class=\"Calendar_DSCell\"><</TD><TD class=\"Calendar_DSCellInput\">2017-08-19</TD><TD class=\"Calendar_DSCell\">></TD><TD class=\"Calendar_DSCell\">>></TD></TR>";
        calendar.DSTable.className = "Calendar_SwitchTB";
        calendar.DSDiv.appendChild(calendar.DSTable);
        calendar.DateCell = calendar.DSTable.querySelector("TD.Calendar_DSCellInput");
        calendar.TSTable = document.createElement("TABLE");
        calendar.TSTable.innerHTML = "<TR><TD class=\"Calendar_DSCell\"><<</TD><TD class=\"Calendar_DSCell\"><</TD><TD class=\"Calendar_DSCellInput\"><INPUT type=\"text\" value=\"20:43:01\" class=\"Calendar_TimeInput\"/></TD><TD class=\"Calendar_DSCell\">></TD><TD class=\"Calendar_DSCell\">>></TD></TR>";
        calendar.TSTable.className = "Calendar_SwitchTB";
        calendar.TSDiv.appendChild(calendar.TSTable);
        calendar.TimeInput = calendar.TSTable.querySelector("INPUT.Calendar_TimeInput");
        calendar.CreateCalendar(calendar.value);

        calendar.Table.onclick = calendar.DateClick;
        calendar.DSTable.onmousedown = function (e) {
            
            if (e.srcElement.className == "Calendar_DSCell") {

                var cmd = e.srcElement.innerText;
                switch (cmd) {

                    case "<<":
                        calendar.ChangeData = function () {
                            calendar.Value = calendar.value.addYears(-1);
                        }
                        break;

                    case "<":
                        calendar.ChangeData = function () {
                            calendar.Value = calendar.value.addMonth(-1);
                        }
                        break;

                    case ">":
                        calendar.ChangeData = function () {
                            calendar.Value = calendar.value.addMonth(1);
                        }
                        break;

                    case ">>":
                        calendar.ChangeData = function () {
                            calendar.Value = calendar.value.addYears(1);
                        }
                        break;


                }

                calendar.CDTime = setInterval(function () {
                    calendar.ChangeData();
                }, 100);

            }

        }

        calendar.DSTable.onmouseup = function (e) {

            calendar.ChangeData = function () { };
            clearInterval(calendar.CDTime);
           
        }

        calendar.TSTable.onmousedown = function (e) {

            if (e.srcElement.className == "Calendar_DSCell") {

                var cmd = e.srcElement.innerText;
                switch (cmd) {

                    case "<<":
                        calendar.ChangeData = function () {
                            calendar.Value = calendar.value.addHours(-1);
                        }
                        break;

                    case "<":
                        calendar.ChangeData = function () {
                            calendar.Value = calendar.value.addMinutes(-1);
                        }
                        break;

                    case ">":
                        calendar.ChangeData = function () {
                            calendar.Value = calendar.value.addMinutes(1);
                        }
                        break;

                    case ">>":
                        calendar.ChangeData = function () {
                            calendar.Value = calendar.value.addHours(1);
                        }
                        break;


                }
                calendar.CDTime = setInterval(function () {
                    calendar.ChangeData();
                }, 100);

            }

        }

        calendar.TSTable.onmouseup = function (e) {

            calendar.ChangeData = function () { };
            clearInterval(calendar.CDTime);
            
        }

        calendar.TimeInput.onkeypress = function (e) {

            var tms = calendar.TimeInput.value.split(":");
            if (tms.length == 3) {

                calendar.value.addSeconds(tms[2]);
                calendar.CDTime = setInterval(function () {
                    calendar.ChangeData();
                }, 100);
            }

        }

        
        calendar.DSTable.ontouchstart = calendar.DSTable.onmousedown;

        calendar.DSTable.ontouchend = calendar.DSTable.onmouseup;

    }

    calendar.DateClick = function (e) {

        if (e.srcElement.tagName.toLowerCase() == "td" && e.srcElement.className.indexOf("Calendar_MDTD") == 0) {

            calendar.Value = e.srcElement.Date;
            calendar.DateSelected(calendar.value,1);
        }

    }




    calendar.DateSelected = function () { }

    calendar.OnValueChanged = function () {

        if (calendar.ValueChanged != undefined)
            calendar.ValueChanged(calendar.value, calendar);

    }


    calendar.CreateCalendar = function (dv) {

        var dv=new Date(dv);
        calendar.Year = dv.getFullYear();
        calendar.Month = dv.getMonth() + 1;
        calendar.Day = dv.getDate();
        calendar.Hour = dv.getHours();
        calendar.Minute = dv.getMinutes();
        calendar.Second = dv.getSeconds();

        calendar.DateCell.innerText = dv.toLocaleDateString();
        calendar.TimeInput.value = dv.toLocaleTimeString();

        var sd =dv.addDays(calendar.Day*-1+1);
        var wd = sd.getDay();
        if (wd == 0)
            wd = 7;

        if (wd > 1)
            sd=sd.addDays(wd * -1+1);

        for (var i = 1; i < 7; i++) {
            var rw = calendar.Table.childNodes[i];
            for (var j = 0; j < 7; j++) {

                var m1 = sd.getMonth() + 1;
                var c = rw.childNodes[j];
                c.innerText = sd.getDate();
                c.Date = sd;
                c.className = "Calendar_MDTD";
                if (m1 != calendar.Month) {
                    c.className = "Calendar_MDTD1";
                }

                if (calendar.Day == sd.getDate() && calendar.Month == m1) {

                    c.className = "Calendar_MDTDSelect";
                }

                sd = sd.addDays(1);
            }

        }



    }

    calendar.value = new Date();


    calendar.GetValue= function () {
            return calendar.value;
        }
    calendar.SetValue = function (v) {
        calendar.value = v;
        calendar.CreateCalendar(v);
        calendar.OnValueChanged();

    }

    calendar.mode = "0";
    Object.defineProperty(calendar, "Mode", {
        get: function () {
            return calendar.mode;
        },
        set: function (v) {
            calendar.mode = v;
            calendar.TSDiv.style.display = "block";
            if(calendar.mode=="0"){
                calendar.TSDiv.style.display = "none";
            }

        }
    });

    calendar.OnCreateHandle();
    return calendar;

}

//评分控件
DBFX.Web.Controls.RateControl = function () {

    var ratecontrol = new DBFX.Web.Controls.Control("RateControl");
    ratecontrol.VisualElement = document.createElement("DIV");
    ratecontrol.OnCreateHandle = function () {




    }

    ratecontrol.OnCreateHandle();
    return ratecontrol;


}

//基本容器
DBFX.Web.Controls.Panel = function (t) {

    if (t == undefined)
        t = "Panel";

    var pnl = new DBFX.Web.Controls.Control(t);
    pnl.ClassDescriptor.Serializer = "DBFX.Serializer.PanelSerializer";
    pnl.ClassDescriptor.DesignTimePreparer = "DBFX.Design.PanelDesignTimePreparer";
    pnl.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.ContainerDesigner");
    pnl.VisualElement = document.createElement("DIV");
    pnl.OnCreateHandle();
    pnl.Controls = new DBFX.Web.Controls.ControlsCollection(pnl);
    pnl.ClientContainer = null;
    pnl.IsContainer = true;
    pnl.OnCreateHandle = function () {

        pnl.ClientDiv = pnl.VisualElement;
        pnl.ClientDiv.className = "Panel";
        pnl.ClientDiv.ondragstart = pnl.OnDragStart;
        pnl.ClientDiv.ondrop = pnl.OnDrop;
        pnl.ClientDiv.ondragend = pnl.OnDragEnd;
        pnl.ClientDiv.ondragover = pnl.OnDragOver;

    }

    Object.defineProperty(pnl, "Border", {
        get: function () {

            return pnl.ClientDiv.style.border;
        },
        set: function (v) {
            pnl.ClientDiv.style.border = v;
        }
    });

    Object.defineProperty(pnl, "Shadow", {
        get: function () {

            return pnl.ClientDiv.style.boxShadow;
        },
        set: function (v) {
            pnl.ClientDiv.style.boxShadow = v;
        }
    });


    pnl.SetBorderRadius = function (v) {

        pnl.ClientDiv.style.borderRadius = v;

    }

    //添加控件
    pnl.AddControl = function (c) {


        pnl.Controls.push(c);
        pnl.ClientDiv.appendChild(c.VisualElement);

        if(c.FormContext==undefined)
            c.FormContext = pnl.FormContext;

        c.DataContext = pnl.DataContext;
        c.Parent = pnl;

    }

    pnl.InsertControl = function (c, tc,pos) {

        var idx = pnl.Controls.indexOf(tc);
        if (idx < 0 )
            pnl.AddControl(c);
        else {

            if (pos == undefined || pos == 0) {
                pnl.Controls.splice(idx, 0, c);
                tc.VisualElement.insertAdjacentElement("beforeBegin", c.VisualElement);
            }
            else {

                pnl.Controls.splice(idx + 1, 0, c);
                tc.VisualElement.insertAdjacentElement("afterEnd", c.VisualElement);


            }

            if (c.FormContext == undefined)
                c.FormContext = pnl.FormContext;
            c.DataContext = pnl.DataContext;

        }

        c.Parent = pnl;

    }

    pnl.Remove = function (c) {

        var idx = pnl.Controls.indexOf(c);
        pnl.Controls.splice(idx, 1);
        pnl.ClientDiv.removeChild(c.VisualElement);
        c.Parent = undefined;
        if (c.Unload != undefined)
            c.Unload();

    }

    pnl.AddElement = function (e) {

        pnl.ClientDiv.appendChild(e);
    }

    pnl.AddHtml = function (s) {

        var e = document.createElement("P");
        e.innerHTML = s;
        pnl.ClientDiv.appendChild(e);
    }


    pnl.DataBind = function (v) {

        for (var i = 0; i < pnl.Controls.length; i++)
            pnl.Controls[i].DataContext = pnl.dataContext;

    }

    pnl.Clear = function () {

        pnl.Controls.forEach(function (c) {
            c.Parent = undefined;
            if (c.UnLoad != undefined)
                c.UnLoad();
        });
        pnl.Controls = new Array();
        pnl.ClientDiv.innerHTML = "";
        
    }


    pnl.Validate = function () {

        var r = true;
        for (var idx = 0; idx < pnl.Controls.length; idx++) {

            if (pnl.Controls[idx].Validate == undefined)
                continue;

            r = pnl.Controls[idx].Validate();
            if (r == false)
                break;

        }

        return r;
    }

    pnl.DesignTime = false;

    pnl.UnLoad = function () {

        pnl.Controls.forEach(function (c) {

            if (c.UnLoad != undefined) {
                if (typeof c.UnLoad == "function")
                    c.UnLoad();

                if (c.UnLoad.GetType() == "Command") {
                    c.UnLoad.Sender = c;
                    c.UnLoad.Execute();
                }


            }

            if (c.UnLoaded != undefined && c.UnLoaded.GetType() == "Command") {
                c.UnLoaded.Sender = c;
                c.UnLoaded.Execute();
            }


        });

        if (pnl.UnLoaded != undefined && pnl.UnLoaded.GetType() == "Command") {
            pnl.UnLoaded.Sender = pnl;
            pnl.UnLoaded.Execute();
        }



    }

    pnl.OnLoad = function () {

        pnl.Controls.forEach(function (c) {

            if (c.OnLoad != undefined) {

                if (typeof c.OnLoad == "function")
                    c.OnLoad();

                if (c.OnLoad.GetType() == "Command") {
                    c.OnLoad.Sender = c;
                    c.OnLoad.Execute();
                }
            }

        });

    }

    pnl.OnCreateHandle();
    return pnl;

}

DBFX.Web.Controls.PopupPanel = function () {

    var ppnl = new DBFX.Web.Controls.Control("PopupPanel");
    ppnl.OnCreateHandle();
    ppnl.ClassDescriptor.Serializer = "DBFX.Serializer.PopupPanelSerializer";
    ppnl.OnCreateHandle = function () {

        ppnl.PopupPanel = document.createElement("DIV");
        ppnl.Cover = document.createElement("DIV");
        ppnl.Cover.className = "PopMenu_Cover";
        ppnl.AutoClosed = true;
        ppnl.VisualElement.style.display = "none";
        ppnl.ClientDiv = ppnl.PopupPanel;

        ppnl.ClientDiv.onresizeend = function () {


        }

    }

    ppnl.MouseDown = function (e) {

        e.preventDefault();
        e.cancelBubble = true;

    }

    ppnl.MouseUp = function (e) {
        e.preventDefault();
        e.cancelBubble = true;
    }

    ppnl.Click = function (e) {
        e.preventDefault();
        e.cancelBubble = true;
    }

       
    ppnl.Show = function (c) {

        ppnl.Cover.className = "PopMenu_Cover";
        ppnl.Cover.style.position = "fixed";
        ppnl.PopupPanel.className = "POPUP_Panel";
        ppnl.PopupPanel.style.position = "absolute";
        ppnl.PopupPanel.style.display = "block";
        var rc = null;
        if(c.VisualElement!=undefined)
            rc = c.ClientDiv.getBoundingClientRect();
        else
            rc = c.getBoundingClientRect();

        var x = rc.left;
        var y = rc.top + rc.height;


        document.body.appendChild(ppnl.Cover);
        ppnl.Cover.style.top = "0px";
        ppnl.Cover.style.left = "0px";
        ppnl.Cover.style.right="0px";
        ppnl.Cover.style.bottom = "0px";
        
        document.body.appendChild(ppnl.PopupPanel);

        if ((y + ppnl.PopupPanel.clientHeight) >= window.innerHeight)
            y = rc.top - ppnl.PopupPanel.clientHeight - 6;


        if (ppnl.PopupPanel.clientWidth < rc.width)
            ppnl.PopupPanel.style.width=rc.width+"px";

        if ((x + ppnl.PopupPanel.clientWidth) >= window.innerWidth)
            x = window.innerWidth - ppnl.PopupPanel.clientWidth-6;


        if (y <= 0) {

            ppnl.PopupPanel.style.height = (ppnl.PopupPanel.clientHeight + y-6) + "px";
            ppnl.PopupPanel.style.overflow = "auto";
            y = 6;
        }

        if ((y+ppnl.PopupPanel.clientHeight) >= window.innerHeight) {

            ppnl.PopupPanel.style.height = (ppnl.PopupPanel.clientHeight - ((y + ppnl.PopupPanel.clientHeight) - window.innerHeight - 6)) + "px";
            ppnl.PopupPanel.style.overflow = "auto";
        }


        ppnl.PopupPanel.style.left = x + "px";
        ppnl.PopupPanel.style.top = y + "px";

        ppnl.Cover.onmousedown = ppnl.PopupPanelMouseDown;

        DBFX.Web.Controls.PopupPanel.ActivedPanel = ppnl;

        ppnl.IsOpen = true;

    }

    ppnl.ShowAt = function (x,y,ch) {

        ppnl.Cover.className = "PopMenu_Cover";
        ppnl.Cover.style.position = "fixed";
        ppnl.PopupPanel.className = "POPUP_Panel";
        ppnl.PopupPanel.style.position = "absolute";
        ppnl.PopupPanel.style.display = "block";
        if (x == undefined && y == undefined) {

            x = 0;
            y = 0;

        }

        document.body.appendChild(ppnl.Cover);
        ppnl.Cover.style.top = "0px";
        ppnl.Cover.style.left = "0px";
        ppnl.Cover.style.right = "0px";
        ppnl.Cover.style.bottom = "0px";

        ppnl.PopupPanel.style.left = x + "px";
        ppnl.PopupPanel.style.top = y + "px";

        document.body.appendChild(ppnl.PopupPanel);

        if (ch == undefined)
            ch = 0;

        if ((y + ppnl.PopupPanel.clientHeight) > window.innerHeight)
            y = y - ppnl.PopupPanel.clientHeight+ch;

        if ((x + ppnl.PopupPanel.clientWidth) >= window.innerWidth)
            x = window.innerWidth - ppnl.PopupPanel.clientWidth - 6;


        ppnl.PopupPanel.style.left = x + "px";
        ppnl.PopupPanel.style.top = y + "px";

        ppnl.Cover.onmousedown = ppnl.PopupPanelMouseDown;
        ppnl.Cover.onmouseup = function (e) {
            e.cancelBubble = true;
            e.preventDefault();

        }

        ppnl.Cover.onclick = function (e) {

            e.cancelBubble = true;
            e.preventDefault();
        }


        DBFX.Web.Controls.PopupPanel.ActivedPanel = ppnl;

        ppnl.IsOpen = true;

    }

    ppnl.PopupPanelMouseDown = function (e) {

        e.cancelBubble = true;
        e.preventDefault();
        if (ppnl.AutoClosed) {
            
            var rc = ppnl.PopupPanel.getBoundingClientRect();
            if (e.x < rc.left || e.x > rc.right || e.y < rc.top || e.y > rc.bottom) {

                ppnl.Close();

            }
        }

    }

    ppnl.Controls = new DBFX.Web.Controls.ControlsCollection(ppnl);
    ppnl.AddControl = function (c) {

        ppnl.PopupPanel.appendChild(c.VisualElement);

        c.DataContext = ppnl.DataContext;

        if (c.FormContext == undefined)
            c.FormContext = ppnl.FormContext;

        ppnl.Controls.push(c);
    }

    ppnl.Clear = function () {

        ppnl.Controls = new Array();
        ppnl.PopupPanel.innerHTML = "";

    }

    ppnl.IsOpen = false;
    ppnl.Close = function () {

        document.body.removeChild(ppnl.PopupPanel);
        document.body.removeChild(ppnl.Cover);
        ppnl.Cover.onmousedown = null;
        DBFX.Web.Controls.PopupPanel.ActivedPanel = null;

        if (ppnl.Closed != undefined)
            ppnl.Closed(ppnl);

        ppnl.IsOpen = false;

    }

    ppnl.Closed = function (sender) {


    }

    ppnl.Validate = function () {

        var r = true;
        for (var idx = 0; idx < ppnl.Controls.length; idx++) {

            if (ppnl.Controls[idx].Validate == undefined)
                continue;

            r = ppnl.Controls[idx].Validate();
            if (r == false)
                break;

        }

        return r;
    }

    ppnl.DataBind = function (v) {

        for (var i = 0; i < ppnl.Controls.length; i++)
            ppnl.Controls[i].DataContext = ppnl.dataContext;

    }

    ppnl.UnLoad = function () {

        ppnl.Controls.forEach(function (c) {

            if (c.UnLoad != undefined) {
                if (typeof c.UnLoad == "function")
                    c.UnLoad();

                if (c.UnLoad.GetType() == "Command") {
                    c.UnLoad.Sender = c;
                    c.UnLoad.Execute();
                }
            }




        });
    }

    ppnl.OnLoad = function () {

        ppnl.Controls.forEach(function (c) {

            if (c.OnLoad != undefined) {

                if (typeof c.OnLoad == "function")
                    c.OnLoad();

                if (c.OnLoad.GetType() == "Command") {
                    c.OnLoad.Sender = c;
                    c.OnLoad.Execute();
                }
            }

        });

    }

    ppnl.OnCreateHandle();
    return ppnl;

}

DBFX.Web.Controls.PopupPanel.ActivedPanel = null;
DBFX.Web.Controls.PopupPanel.ClosePopupPanel = function () {

    if(DBFX.Web.Controls.PopupPanel.ActivedPanel!=null)
        DBFX.Web.Controls.PopupPanel.ActivedPanel.Close();
}
//文件上传框
DBFX.Web.Controls.FileUploadBox = function () {

    var fub = new DBFX.Web.Controls.Control("FileUploadBox");
    fub.ClassDescriptor.Serializer = "DBFX.Serializer.FileUploadBoxSerializer";
    fub.VisualElement = document.createElement("DIV");
    fub.OnCreateHandle();
    fub.OnCreateHandle = function () {
        fub.Class = "FileUploadBox";
        fub.VisualElement.innerHTML = "<DIV class=\"FileUploadBox_IDiv\"></DIV><INPUT type=\"file\" class=\"FileUploadBox_Input\" />";
        fub.ClientDiv = fub.VisualElement;
        fub.FileBox = fub.ClientDiv.querySelector("INPUT.FileUploadBox_Input");
        fub.FIDiv = fub.ClientDiv.querySelector("DIV.FileUploadBox_IDiv");

        fub.btnBrowse = new DBFX.Web.Controls.Button("...", function (e) {

            fub.FileBox.click();
            if (fub.FileBox.files.length > 0) {
                if (fub.FileBox.files[0].size / 1024 > fub.maxSize && fub.maxSize>0) {
                    fub.FNSpan.Text = "图片尺寸过大!";
                }
                else {
                    fub.FNSpan.Text = fub.FileBox.files[0].name;
                    fub.FSSpan.Text = " | " + Math.round(fub.FileBox.files[0].size / 1024) + "KB";
                }
            }

        });

        fub.btnBrowse.Width = "32px";
        fub.btnBrowse.Position = "absolute";
        fub.btnBrowse.Top = "0px";
        fub.btnBrowse.Right = "0px";
        fub.btnBrowse.Height = "auto";
        fub.btnBrowse.Bottom="0px";
        fub.btnBrowse.ZIndex = 1;
        fub.FNSpan = new DBFX.Web.Controls.Label("选择要上传的文件");
        fub.FNSpan.Margin = "3px 2px 2px 2px";

        fub.FSSpan = new DBFX.Web.Controls.Label("");
        fub.FSSpan.Margin = "3px 2px 2px 2px";
        fub.FIDiv.appendChild(fub.btnBrowse.VisualElement);
        fub.FIDiv.appendChild(fub.FNSpan.VisualElement);
        fub.FIDiv.appendChild(fub.FSSpan.VisualElement);


    }

    Object.defineProperty(fub, "File", {
        get: function () {

            if (fub.FileBox.files.length > 0)
                return fub.FileBox.files[0];
            else
                return null;

        }
    });

    fub.maxSize = 0;
    Object.defineProperty(fub, "MaxSize", {
        get: function () {
            return fub.maxSize;
        },
        set: function (v) {

            try{
                fub.maxSize = v*1.0;
            }catch(ex){}

        }
    });


    fub.BrowseFile = function () {

        fub.FileBox.click();

    }

    fub.SetName = function (v) {
        fub.FileBox.name = v;
    }

    fub.GetName = function () {
        return fub.FileBox.name;
    }

    fub.GetValue = function () {
        return fub.FileBox.value;

        
    }

    fub.OnCreateHandle();
    return fub;

}

//文件资源上传控件
DBFX.Web.Controls.FileUploadListView = function () {

    var fuv = new DBFX.Web.Controls.Control("FileUploadListView");
    fuv.OnCreateHandle();
    fuv.OnCreateHandle = function () {



    }

    fuv.OnCreateHandle();
    return fuv;

}

//图片上传控件
DBFX.Web.Controls.ImageUploadBox = function () {

    var iubox = new DBFX.Web.Controls.Control("ImageUploadBox");
    iubox.ClassDescriptor.Serializer = "DBFX.Serializer.ImageUploadBoxSerializer";
    iubox.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.InputControlDesigner");
    iubox.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.ImageUploadBoxDesigner");
    iubox.VisualElement = document.createElement("DIV");
    iubox.OnCreateHandle();
    iubox.OnCreateHandle = function () {
        iubox.Class = "ImageUploadBox";
        iubox.VisualElement.innerHTML = "<INPUT type=\"file\" class=\"ImageUploadBox_File\" /><IMG class=\"ImageUploadBox_Image\" /> <DIV class=\"ImageUploadBox_Tool\"><BUTTON class=\"ImageUploadBox_BrowseFile\">选择图片></BUTTON><BUTTON class=\"ImageUploadBox_Upload\" >上传图片></BUTTON></DIV><DIV class=\"ImageUploadBox_ProgDiv\"><PROGRESS class=\"ImageUploadBox_Progress\"><LABEL class=\"ImageUploadBox_ProgressText\" /></PROGRESS></DIV>";
        iubox.ClientDiv = iubox.VisualElement;
        iubox.File = iubox.VisualElement.querySelector("INPUT.ImageUploadBox_File");
        iubox.Image = iubox.VisualElement.querySelector("IMG.ImageUploadBox_Image");

        iubox.ToolDiv = iubox.VisualElement.querySelector("DIV.ImageUploadBox_Tool");
        iubox.BrowseButton = iubox.VisualElement.querySelector("BUTTON.ImageUploadBox_BrowseFile");
        iubox.UploadButton = iubox.VisualElement.querySelector("BUTTON.ImageUploadBox_Upload");

        iubox.ProgDiv = iubox.VisualElement.querySelector("DIV.ImageUploadBox_ProgDiv");
        iubox.ProgSpan = iubox.VisualElement.querySelector("LABEL.ImageUploadBox_ProgressText");
        iubox.Progress = iubox.VisualElement.querySelector("PROGRESS.ImageUploadBox_Progress");

        iubox.UploadButton.disabled = true;

        iubox.IsClicked = false;
        iubox.OrgPoint = null;
        iubox.Scale = 1;

        iubox.File.onchange = iubox.LoadPicture;


        iubox.BrowseButton.onclick = function (e) {
            e.cancelBubble = true;
            iubox.IsClicked = false;
            iubox.OrgPoint = null;
            iubox.BrowseFile();

        }

        iubox.UploadButton.onclick = function (e) {
            e.cancelBubble = true;
            iubox.UploadImage();

        }

        iubox.ClientDiv.onmousedown = function (e) {
            e.cancelBubble = true;
            e.preventDefault();
            if (iubox.IsFillImaged && e.srcElement == iubox.ClientDiv) {
                iubox.IsClicked = true;
                iubox.OrgPoint = new Object();
                iubox.OrgPoint.x = e.x;
                iubox.OrgPoint.y = e.y;
                iubox.OrgBPoint = new Object();

                var iw = iubox.Image.width * iubox.Scale;
                if (iubox.ClientDiv.style.backgroundPositionX == "")
                    iubox.OrgBPoint.x = (iubox.ClientDiv.clientWidth-iw) / 2;
                else
                    iubox.OrgBPoint.x = iubox.ClientDiv.style.backgroundPositionX.replace("px", "") * 1;

                var ih= iubox.Image.height * iubox.Scale;
                if (iubox.ClientDiv.style.backgroundPositionY == "")
                    iubox.OrgBPoint.y = (iubox.ClientDiv.clientHeight-ih) / 2;
                else
                    iubox.OrgBPoint.y = iubox.ClientDiv.style.backgroundPositionY.replace("px", "") * 1;

                iubox.ClientDiv.style.cursor = "move";
                iubox.ClientDiv.setCapture();
            }

        }

        iubox.ClientDiv.onmouseup = function (e) {
            if (iubox.IsFillImaged) {
                iubox.IsClicked = false;
                iubox.OrgPoint = null;
                iubox.ClientDiv.style.cursor = "default";
                iubox.ClientDiv.releaseCapture();
            }
        }

        iubox.ClientDiv.onmousewheel = function (e) {
            e.cancelBubble = true;
            e.preventDefault();
            if (iubox.IsFillImaged) {
                var w = iubox.Image.width;
                var h = iubox.Image.height;

                if (window.event.wheelDelta > 0)
                    iubox.Scale += 0.02;
                else
                    iubox.Scale -= 0.02;

                w = w * iubox.Scale;
                h = h * iubox.Scale;

                iubox.ClientDiv.style.backgroundSize = w + "px " + h + "px";
            }

        }

        iubox.ClientDiv.onmousemove = function (e) {

            if (iubox.IsClicked) {

                e.cancelBubble = true;

                var xc = (iubox.OrgBPoint.x + (e.x-iubox.OrgPoint.x)) + "px";
                var yc = (iubox.OrgBPoint.y + (e.y-iubox.OrgPoint.y)) + "px";
                
                iubox.ClientDiv.style.backgroundPositionX = xc;
                iubox.ClientDiv.style.backgroundPositionY = yc;
                

            }

        }
        
        iubox.ClientDiv.onmouseenter = function (e) {

            iubox.ToolDiv.style.display = "block";
        }

        iubox.ClientDiv.onmouseout = function (e) {

            var rect = iubox.ClientDiv.getBoundingClientRect();

           
            

            if (!iubox.IsClicked && (e.pageX < rect.left || e.pageY < rect.top || e.pageX > rect.right || e.pageY > rect.bottom))
            {

                iubox.ToolDiv.style.display = "none";

            }

        }

    }

    iubox.UploadImage = function () {

        var xml = document.createElementNS("", "Image");

        var iw = iubox.Image.width * iubox.Scale;
        var offsetx = "0";
        if (iubox.ClientDiv.style.backgroundPositionX != "")
            offsetx = iubox.ClientDiv.style.backgroundPositionX.replace("px", "");
        else
            offsetx = (iubox.ClientDiv.clientWidth - iw) / 2;

        if (iubox.ClientDiv.clientWidth > iw)
            offsetx = "0";

        xml.setAttribute("OffsetX", offsetx);

        var ih = iubox.Image.height * iubox.Scale;

        var offsety = "0";
        if (iubox.ClientDiv.style.backgroundPositionY != "")
            offsety = iubox.ClientDiv.style.backgroundPositionY.replace("px", "");
        else
            offsety = (iubox.ClientDiv.clientHeight - ih) / 2;

        if (iubox.ClientDiv.clientHeight > ih)
            offsety = "0";

        xml.setAttribute("OffsetY", offsety);

        xml.setAttribute("Scale", iubox.Scale.toString());
        xml.setAttribute("Height", iubox.ClientDiv.clientHeight);
        xml.setAttribute("Width", iubox.ClientDiv.clientWidth);
        var imgdata = document.createElementNS("", "ImageData");
        imgdata.textContent = iubox.Image.src;
        xml.appendChild(imgdata);
        var xmlserialer = new window.XMLSerializer();
        var xmldata = xmlserialer.serializeToString(xml);

        var formdata = new FormData();
        formdata.append("ImageFile",iubox.File.files[0]);
        formdata.append("ImageCroper", xmldata);

        iubox.ProgDiv.style.display = "block";

        var reg=new RegExp("%","g"); //创建正则RegExp对象    

        iubox.action = iubox.action.replace(reg, "");

        DBFX.Net.WebClient.ExecuteWebRequest(iubox.action, "POST", iubox.UploadImageCompleted, iubox, formdata, function (e) {

            iubox.Progress.max = 100;
            iubox.Progress.value = ((e.loaded / e.total) * 100).toFixed(0);
            var pv = 0;
            pv = (e.loaded / e.total) * 100;
            iubox.ProgSpan.innerText =pv.toFixed(2) + "%";

        });

    }

    iubox.UploadImageCompleted=function(respjson,ctx)
    {
        iubox.ProgDiv.style.display = "none";
        var resp = eval(respjson)[0];
        if (resp.State == 0) {

            var updata = JSON.parse(resp.JSonData);

            iubox.IsFillImaged = false;
            iubox.UploadButton.disabled = true;

            iubox.Image.src = "";
            iubox.ClientDiv.style.backgroundImage = "";

            iubox.Scale = 1;
            iubox.ClientDiv.style.backgroundSize = "";
            iubox.ClientDiv.style.backgroundPositionX = "";
            iubox.ClientDiv.style.backgroundPositionY = "";

            iubox.Image.src = updata.Url;
            iubox.ClientDiv.style.backgroundImage = "url('" + updata.Url + "')";

            iubox.SetValue(updata.Url);

        }
        else {

           

        }


    }
 
    iubox.ValueChanged = function (e) {



    }

    iubox.DblClick = function (e) {

        //iubox.IsClicked = false;
        //iubox.OrgPoint = null;

        //iubox.BrowseFile();

    }

    iubox.IsFillImaged = false;

    iubox.BrowseFile = function (e) {

        //浏览文件
        iubox.File.click();

    }

    iubox.LoadPicture = function () {

        if (iubox.File.files.length > 0) {
            //document.title = iubox.File.files[0].name;
            var reader = new FileReader();
            reader.onload = function (evt) {

                var ctype = evt.target.result.split(";")[0].split(":")[1].split("/")[1];
                if (iubox.filter == null || iubox.filter.indexOf(ctype) >= 0) {
                    iubox.IsFillImaged = true;
                    iubox.UploadButton.disabled = false;
                    iubox.Scale = 1;
                    iubox.ClientDiv.style.backgroundSize = "";
                    iubox.ClientDiv.style.backgroundPositionX = "";
                    iubox.ClientDiv.style.backgroundPositionY = "";
                    iubox.Image.src =  evt.target.result;
                    iubox.ClientDiv.style.backgroundImage = "url('" + evt.target.result + "')";
                    iubox.SetValue(iubox.Image.src);
                }
                else {

                }
            }


            reader.readAsDataURL(iubox.File.files[0]);

        }

    }

    iubox.SetValue = function (v) {

        iubox.ImageUrl = v;

        if (iubox.dataBindings != undefined && iubox.dataContext != undefined) {

            iubox.dataContext[iubox.dataBindings.Path] =v;

        }
        //if (iubox.FormContext != null && iubox.dataProperty != "")
        //    iubox.FormContext[iubox.dataProperty] = v;

        iubox.RegisterFormContext();

    }

    iubox.RegisterFormContext = function () {
        if (iubox.FormContext != null && iubox.dataProperty != "" && iubox.dataProperty != undefined) {
            if (iubox.dataDomain != undefined && iubox.dataDomain != "") {

                var ddv = iubox.FormContext[iubox.dataDomain];
                if (ddv == undefined)
                    iubox.FormContext[iubox.dataDomain] = new DBFX.DataDomain();

                iubox.FormContext[iubox.dataDomain][iubox.dataProperty] = iubox.ImageUrl;

            }
            else {
                iubox.FormContext[iubox.dataProperty] = iubox.ImageUrl;
            }
        }
    }

    iubox.GetValue = function () {

        return iubox.imageurl;

    }

    Object.defineProperty(iubox, "Filter", {
        get: function () {
            return iubox.filter;

        },
        set: function (v) {
            
            iubox.filter = v;
        }
    });

    Object.defineProperty(iubox, "ImageUrl", {
        get: function () {

            return iubox.imageurl;

        },
        set: function (v)
        {
            if(v!=undefined)
                v = v.replace("http://wfs.dbazure.cn", "https://wfs.dbazure.cn")

            iubox.imageurl = v;
            iubox.Image.src = v;
            if(v!=undefined && v!="")
                iubox.ClientDiv.style.backgroundImage = "url('" + v + "')";

            if(v!=undefined && v!=null && v!="")
                iubox.ToolDiv.style.display = "none";
            else
                iubox.ToolDiv.style.display = "";

            iubox.Scale = 1;
            iubox.ClientDiv.style.backgroundSize = "";
            iubox.ClientDiv.style.backgroundPositionX = "";
            iubox.ClientDiv.style.backgroundPositionY = "";


        }
    });



    Object.defineProperty(iubox, "Action", {
        get: function () {

            return iubox.action;

        },
        set: function (v) {
            iubox.action=app.EnvironVariables.ParsingToString(v);
        }
    });

    iubox.Validate = function () {

        var r = true;

        if (iubox.NBC == undefined)
            iubox.NBC = iubox.BorderColor;

        if (iubox.imageurl == undefined || iubox.imageurl == "" || iubox.imageurl.length > 1000) {

            r = false;
            iubox.BorderColor = "red";

        }
        else
        {

            iubox.BorderColor = iubox.NBC;

        }

        return r;

    }

    iubox.OnCreateHandle();
    return iubox;

}

//

//Web文件系统浏览器
/*
 AppId UId OwnerId Filter Path
 wcmd 0 浏览 1 上传 2下载 3创建文件夹 4删除文件夹 5 删除文件 6 返回
*/
DBFX.Web.Controls.WebFSExplorer = function () {

    var wfsv = new DBFX.Web.Controls.Control("WebFSExplorer");
    wfsv.ClassDescriptor.DisplayName = "Web文件系统";
    wfsv.ClassDescriptor.Description = "Web文件系统";
    wfsv.ClassDescriptor.Serializer = "DBFX.Serializer.WebFSExplorer";
    wfsv.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.WebFSExplorerDesigner");
    wfsv.VisualElement = document.createElement("DIV");
    wfsv.OnCreateHandle();

    wfsv.OnCreateHandle = function () {
        wfsv.VisualElement.className = "WebFSExplorer";
        wfsv.VisualElement.innerHTML = "<INPUT type=\"file\" class=\"WebFSExplorer_File\" style=\"width:1px; height:1px\"/>";
        wfsv.File = wfsv.VisualElement.querySelector("INPUT.WebFSExplorer_File");
        wfsv.File.onchange = wfsv.OnUploadImage;
        wfsv.ClientDiv = wfsv.VisualElement;
        wfsv.rvpnl = new DBFX.Web.Controls.Panel();
        wfsv.rvpnl.Shadow = "none";
        wfsv.AddControl(wfsv.rvpnl);
        wfsv.rvpnl.FormContext = new Object();
        wfsv.rvpnl.FormControls = new Object();
        wfsv.rvpnl.FormContext.Form = wfsv.rvpnl;

        wfsv.LoadUIResource();
        wfsv.Action = "wfs/wfs.ashx?AppId=%appid%&UId=%uid%&OwnerId=%ownerid%&filter=jpg|png|gif";
        wfsv.model = 1;
    }

    //加载资源
    wfsv.LoadUIResource = function () {

        DBFX.Resources.LoadResource("Themes/" + app.CurrentTheme + "/ControlTemplates/WebFSExplorer.scrp", function (rvpnl) {


            wfsv.ListView = rvpnl.FormContext.Form.FormControls["WebFSListView"];
            wfsv.TreeView = rvpnl.FormContext.Form.FormControls["FolderTree"];

            wfsv.ToolStrip = rvpnl.FormContext.Form.FormControls["WebFSToolStrip"];
            wfsv.ToolStrip.ToolStripItemClick = wfsv.ToolStripItemClick;
            wfsv.ResViewPanel = rvpnl;
            wfsv.ListView.ItemTemplateSelector = wfsv.FileTemplateSelector;

            wfsv.LoadWebFSResource();

            wfsv.ListView.SelectedItemDblClick = wfsv.SelectedItemDoubleClick;
            wfsv.ListView.SelectedItemChanged = wfsv.OnResourceItemSelected;

            wfsv.CurrentPath = "";
            if (wfsv.TreeView != undefined) {
                wfsv.TreeView.TreeListNodeClick = function (tnode) {
                    wfsv.TreeNodeLoadChild(tnode);

                }
            }

            wfsv.Model = wfsv.model;
            if (wfsv.DesignTime) {

                wfsv.VisualElement.removeChild(wfsv.DesignPan.VisualElement);
                wfsv.VisualElement.appendChild(wfsv.DesignPan.VisualElement);
            }

        }, wfsv.rvpnl);

    }
    //设置模式
    wfsv.SetModel = function (model) {
        if (wfsv.rvpnl) {
            wfsv.TreeListPanel = wfsv.rvpnl.FormContext.Form.FormControls["FolderTree"];
            wfsv.WebFSSplitter = wfsv.rvpnl.FormContext.Form.FormControls["WebFSSplitter"];

            if (wfsv.TreeListPanel != undefined) {
                wfsv.Tool4 = wfsv.rvpnl.FormContext.Form.FormControls["4"];

                if (model != 1) {
                    wfsv.TreeListPanel.Display = "none";
                    wfsv.Tool4.Display = "none";
                    wfsv.WebFSSplitter.Display = "none";

                } else {
                    wfsv.TreeListPanel.Display = "";
                    wfsv.Tool4.Display = "";
                    wfsv.WebFSSplitter.Display = "";
                }

                wfsv.TreeListPanel.Parent.ReLayoutControls();
            }

        }
    }
    wfsv.TreeNodeLoadChild = function (tnode) {
        wfsv.CurrentFolder = tnode;
        wfsv.CurrentPath = tnode.dataContext.ParentDir + (tnode.dataContext.ParentDir.length > 0 ? "/" : "") + tnode.dataContext.Name;
        wfsv.browserTempAction = wfsv.browserAction + wfsv.CurrentPath;
        wfsv.LoadWebFSResource();
    }

    //选中
    wfsv.OnResourceItemSelected = function (lvw, item) {
        wfsv.SelectedItem = item;
        if (wfsv.ResourceItemSelected != null && wfsv.ResourceItemSelected != undefined) {
            wfsv.ResourceItemSelected(item);
        }
    }
    //加载资源
    wfsv.LoadWebFSResource = function () {


        var formdata = new FormData();
        wfsv.HttpClient(wfsv.browserTempAction ? wfsv.browserTempAction : wfsv.browserAction, "POST", formdata, function (resp) {

            var resp = eval(resp)[0];
            if (resp.State == 0) {
                var jobj = eval("(" + resp.JSonData + ")");
                var files = jobj.Files;
                var dirs = jobj.Dirs;

                if (wfsv.CurrentFolder == undefined) {
                    var tnd = wfsv.TreeView.CreateTreeNode();
                    wfsv.TreeView.AddNode(tnd);
                    tnd.DataContext = { Name: "", Text: "Root", ParentDir: "", ExpandedImageUrl: "/themes/" + app.CurrentTheme + "/Images/WebFSExplorer/folder1.png", ImageUrl: "/themes/" + app.CurrentTheme + "/Images/WebFSExplorer/folder1.png" };
                    wfsv.CurrentFolder = tnd;
                }
                wfsv.CurrentFolder.ClearNodes();
                dirs.forEach(function (dir) {
                    var tnd = wfsv.TreeView.CreateTreeNode();
                    wfsv.CurrentFolder.AddNode(tnd);
                    dir.Text = dir.Name;
                    dir.ExpandedImageUrl = "/themes/" + app.CurrentTheme + "/Images/WebFSExplorer/folder1.png";
                    dir.ImageUrl = "/themes/" + app.CurrentTheme + "/Images/WebFSExplorer/folder1.png"
                    dir.TreeNode = tnd;
                    tnd.DataContext = dir;
                });
                wfsv.ListView.ItemSource = dirs.concat(files);
            }

        }, function (e) {


        });
    }
    //文件夹双击
    wfsv.SelectedItemDoubleClick = function (item) {

        if (item.dataContext.FileType.toLowerCase() == "folder") {
            //alert(item.dataContext.Name); 
            wfsv.TreeNodeLoadChild(item.dataContext.TreeNode);
        }
    }




    //WebFSToolStrip ItemClick
    //wcmd 0 浏览 1 上传 2下载 3创建文件夹 4删除文件夹 5 删除文件 6 返回
    wfsv.ToolStripItemClick = function (tb, item) {
        if (item.Name == "1") {
            wfsv.File.click();
        } else if (item.Name == "0") {
            wfsv.LoadWebFSResource();
        } else if (item.Name == "2") {
            wfsv.DownLoadFile()
        } else if (item.Name == "3") {
            wfsv.NewPath();
        } else if (item.Name == "4") {
            wfsv.deletePath();
        } else if (item.Name == "6") {
            wfsv.backParentPath();
        }
    }
    //POPUP 创建文件夹
    wfsv.CreatePopPanel = function () {
        wfsv.pop = DBFX.Web.Controls.PopupPanel();
        wfsv.pop.Width = "250px";
        wfsv.newFileTitle = DBFX.Web.Controls.TextBlock();
        wfsv.newFileTitle.Text = "创建文件夹";
        wfsv.newFileTitle.Display = "block";
        wfsv.pop.AddControl(wfsv.newFileTitle);
        wfsv.newFileText = DBFX.Web.Controls.TextBox();
        wfsv.newFileText.Width = "180px";
        wfsv.pop.AddControl(wfsv.newFileText);
        wfsv.newFileButton = DBFX.Web.Controls.Button("确定");
        wfsv.pop.AddControl(wfsv.newFileButton);
        wfsv.newFileButton.Click = function () {
            var formdata = new FormData();
            wfsv.HttpClient(wfsv.createPathAction + wfsv.CurrentPath + "/" + wfsv.newFileText.Value, "POST", formdata, function (respjson) {
                var resp = eval(respjson)[0];
                if (resp.State == 0) {
                    wfsv.pop.Close();
                    wfsv.LoadWebFSResource();
                }
            }, function (e) {


            });
        }
    }
    //创建文件夹
    wfsv.NewPath = function () {
        if (!wfsv.pop) {
            wfsv.CreatePopPanel();
        }
        wfsv.pop.Show(wfsv.newFileButton);
        //wfsv.pop.ShowAt(wfsv.newFileButton.VisualElement.clientLeft, wfsv.newFileButton.VisualElement.clientTop);

    }
    //删除文件 文件夹
    wfsv.deletePath = function () {
        if (wfsv.SelectedItem && wfsv.SelectedItem.dataContext.FileType.toLowerCase() == "folder") {
            var formdata = new FormData();
            wfsv.HttpClient(wfsv.deletePathAction + wfsv.CurrentPath + "/" + wfsv.SelectedItem.dataContext.Name, "POST", formdata, function (respjson) {
                var resp = eval(respjson)[0];
                if (resp.State == 0) {
                    wfsv.LoadWebFSResource();
                } else {
                    alert(resp.Exception);
                }
            }, function (e) {


            });
        } else if (wfsv.SelectedItem) {
            var formdata = new FormData();
            wfsv.HttpClient(wfsv.deleteFileAction + wfsv.CurrentPath + "/" + wfsv.SelectedItem.dataContext.FileName, "GET", formdata, function (respjson) {
                var resp = eval(respjson)[0];
                if (resp.State == 0) {

                    wfsv.LoadWebFSResource();
                }
            }, function (e) {


            });
        }

    }
    //返回上一层文件夹
    wfsv.backParentPath = function () {
        if (wfsv.CurrentFolder && wfsv.CurrentFolder.ParentNode) {
            wfsv.TreeNodeLoadChild(wfsv.CurrentFolder.ParentNode);

        }

    }
    //下载文件
    wfsv.DownLoadFile = function () {
        if (wfsv.SelectedItem && wfsv.SelectedItem.dataContext.FileType.toLowerCase() != "folder") {
            var formdata = new FormData();
            wfsv.HttpClient(wfsv.downloadAction + wfsv.CurrentPath + "/" + wfsv.SelectedItem.dataContext.FileName, "POST", formdata, function (respjson) {
                var resp = eval(respjson)[0];
                if (resp.State == 0) {

                    wfsv.LoadWebFSResource();
                }
            }, function (e) {


            });
        }

    }
    //上传图片
    wfsv.OnUploadImage = function () {
        var formdata = new FormData();
        formdata.append("ImageFile", wfsv.File.files[0]);
        wfsv.HttpClient(wfsv.uploadAction + wfsv.CurrentPath, "POST", formdata, function (respjson) {
            var resp = eval(respjson)[0];
            if (resp.State == 0) {
                wfsv.LoadWebFSResource();
            }
        }, function (e) {


        });
    }
    //网络接口
    wfsv.HttpClient = function (Action, Method, FormData, callback, progress) {
        DBFX.Net.WebClient.ExecuteWebRequest(Action, Method, callback, wfsv, FormData, progress);
    }
    //0正常 1选定 2编辑 
    wfsv.FileTemplateSelector = function (file, selected) {

        var ext = file.FileType.toLowerCase();
        var template = "all";
        for (var key in wfsv.ListView.Templates) {

            if (key.indexOf(ext) >= 0) {
                template = key;
                if (selected == 1) {
                    template = template + "selected";
                }
                break;
            }
        }
        return template;

    }

    wfsv.Controls = new Array();
    wfsv.AddControl = function (c) {
        wfsv.Controls.push(c);
        wfsv.ClientDiv.appendChild(c.VisualElement);
        if (c.FormContext == undefined)
            c.FormContext = wfsv.FormContext;
        c.DataContext = wfsv.DataContext;

    }

    //
    wfsv.Clear = function () {

        wfsv.Controls = new Array();
        wfsv.ClientDiv.innerHTML = "";
    }
    Object.defineProperty(wfsv, "Action", {
        get: function () {
            return wfsv.baseAction;

        },
        set: function (v) {
            wfsv.baseAction = app.EnvironVariables.ParsingToString(v);//v != undefined ? v.replace("%appid%", app.EnvironVariables.AppId).replace("%uid%", app.EnvironVariables.UId).replace("%ownerid%", app.EnvironVariables.OwnerId).replace("%developing_appid%", app.EnvironVariables.Developing_AppId) : "";// v.replace("%currenttheme%", app.CurrentTheme);
            wfsv.uploadAction = wfsv.baseAction + "&wcmd=1&Path=";
            wfsv.browserAction = wfsv.baseAction + "&wcmd=0&Path=";
            wfsv.downloadAction = wfsv.baseAction + "&wcmd=2&Path=";
            wfsv.createPathAction = wfsv.baseAction + "&wcmd=3&Path=";
            wfsv.deleteFileAction = wfsv.baseAction + "&wcmd=5&Path=";
            wfsv.deletePathAction = wfsv.baseAction + "&wcmd=4&Path=";
        }
    });

    //1简单模式 上传浏览 新建 2 高级功能 All
    Object.defineProperty(wfsv, "Model", {
        get: function () {
            return wfsv.model;

        },
        set: function (v) {
            wfsv.model = v;
            wfsv.SetModel(v);
        }
    });



    wfsv.OnCreateHandle();
    return wfsv;

}
//网页表单控件用于局部执行httpPost
DBFX.Web.Controls.WebPageForm = function () {

    var wform = new DBFX.Web.Controls.Control("WebForm");
    wform.ClassDescriptor.Serializer = "DBFX.Serializer.WebPageFormSerializer";
    wform.OnCreateHandle();
    wform.OnCreateHandle = function () {

        wform.VisualElement.innerHTML = "<FORM class=\"WebPageForm\" enctype=\"multipart/form-data\"  />";
        wform.PageForm = wform.VisualElement.children[0];
        wform.PageForm.onsubmit = function () {
            return false;
        }
    }

    wform.Controls = new DBFX.Web.Controls.ControlsCollection(wform);

    wform.AddControl = function (c) {

        wform.Controls.push(c);
        wform.PageForm.appendChild(c.VisualElement);

    }

    wform.AddField = function (name, value) {

        var input = document.createElement("INPUT");
        input.name = name;
        input.value = value;
        wform.PageForm.appendChild(input);

    }

    wform.Submit = function () {
        
        var formdata = new FormData(wform.PageForm);
       
        DBFX.Net.WebClient.ExecuteWebRequest(wform.Action, "POST", wform.SubmitCompleted,wform,formdata, wform.SubmitProgress);


    }

    wform.SubmitCompleted = function (resp,ctxobj) {

        alert(resp);

    }

    wform.SubmitProgress = function (e) {

        //document.title = "Uploading:" + (e.loaded / e.total) * 100;

    }

    //
    Object.defineProperty(wform, "Action", {
        get: function () {
            return wform.action;

        },
        set: function (v) {

            wform.action = v;

        }

    });

    Object.defineProperty(wform, "FormName", {
        get: function () {

            return wform.PageForm.name;

        },
        set: function (v) {

            wform.PageForm.name = v;

        }

    });

    wform.OnCreateHandle();
    return wform;
}

//加载动画对象
DBFX.Web.Controls.LoadingPanel = new Object();
DBFX.Web.Controls.LoadingPanel.IsClose = true;
DBFX.Web.Controls.LoadingPanel.PanelElement = null;
DBFX.Web.Controls.LoadingPanel.LoadingAni = null;

DBFX.Web.Controls.LoadingPanel.Show = function (t) {

    if (DBFX.Web.Controls.LoadingPanel.PanelElement == undefined || DBFX.Web.Controls.LoadingPanel.PanelElement == null) {

        DBFX.Web.Controls.LoadingPanel.PanelElement = document.createElement("DIV");
        DBFX.Web.Controls.LoadingPanel.PanelElement.className = "LoadingPanel";
        DBFX.Web.Controls.LoadingPanel.PanelElement.innerHTML = "<DIV class=\"LoadingAni\"><IMG class=\"LoadingAniImage\"  /><SPAN class=\"LoadingAniSpan\">加载中，请稍后...</SPAN></DIV>";
        DBFX.Web.Controls.LoadingPanel.TextSpan = DBFX.Web.Controls.LoadingPanel.PanelElement.querySelector("SPAN.LoadingAniSpan");
        var img = DBFX.Web.Controls.LoadingPanel.PanelElement.querySelector("IMG.LoadingAniImage");
        img.src = "themes/" + app.CurrentTheme + "/images/loading1.gif";

    }

    if (t == undefined) {

        DBFX.Web.Controls.LoadingPanel.TextSpan.innerText = "加载中，请稍后...";
    }
    else
        DBFX.Web.Controls.LoadingPanel.TextSpan.innerText = t;

    //显示加载图标
    if (DBFX.Web.Controls.LoadingPanel.IsClose) {

        document.body.appendChild(DBFX.Web.Controls.LoadingPanel.PanelElement);
        

    }

    DBFX.Web.Controls.LoadingPanel.IsClose = false;

}

DBFX.Web.Controls.LoadingPanel.Close = function () {

    if(!DBFX.Web.Controls.LoadingPanel.IsClose)
    {
        document.body.removeChild(DBFX.Web.Controls.LoadingPanel.PanelElement);
        //document.body.removeChild(DBFX.Web.Controls.LoadingPanel.LoadingAni);
        DBFX.Web.Controls.LoadingPanel.IsClose=true;
    }

}

//搜索栏
DBFX.Web.Controls.SearchBar = function () {

    var sbar = new DBFX.Web.Controls.Control("SearchBar");
    sbar.ClassDescriptor.Serializer = "DBFX.Serializer.SearchBarSerializer";
    sbar.OnCreateHandle();
    sbar.OnCreateHandle = function () {

        sbar.VisualElement.innerHTML = "<DIV class=\"SearchBar\" ><DIV class=\"SearchBar_TipLabel\"></DIV><DIV class=\"SearchBar_TBDiv\"><INPUT class=\"SearchBar_TextBox\" /></DIV><IMG class=\"SearchBar_Button\" /></DIV>";
        sbar.ClientDiv = sbar.VisualElement.querySelector("DIV.SearchBar");
        sbar.TextBox = sbar.VisualElement.querySelector("INPUT.SearchBar_TextBox");
        sbar.SearchButton = sbar.VisualElement.querySelector("IMG.SearchBar_Button");
        sbar.TipLable = sbar.VisualElement.querySelector("DIV.SearchBar_TipLabel");

        sbar.TextBox.onchange = sbar.TextBoxChanged;
        sbar.SearchButton.onclick = sbar.OnSearching;
        sbar.SearchButton.src = "Themes/" + app.CurrentTheme + "/Images/SearchBar/Search.png";
        sbar.TextBox.onkeyup = sbar.TextBoxKeyUp;
    }

    Object.defineProperty(sbar, "TipText", {
        get: function () {
            return sbar.TipLable.innerText;
        },
        set: function (v) {
            if (v == null || v == undefined)
                sbar.TipLable.innerText = "";
            else
                sbar.TipLable.innerText = v;
        }
    });

    sbar.SetText = function (v) {

        sbar.TextBox.value = v;
        if(v!=undefined && v!=null && v!="")
            sbar.TipLable.style.display = "none";

    }

    sbar.SetValue = function (v) {

        sbar.TextBox.value = v;
        if (v != undefined && v != null && v != "")
            sbar.TipLable.style.display = "none";

    }


    sbar.GetText = function () {

        return sbar.TextBox.value;
    }

    sbar.TextBoxChanged = function (e) {


        if (sbar.dataBindings != undefined && sbar.dataContext != undefined) {

            sbar.dataContext[sbar.dataBindings.Path] = sbar.TextBox.value;

        }
        if (sbar.FormContext != null && sbar.dataProperty != "")
            sbar.FormContext[sbar.dataProperty] = sbar.TextBox.value;
        

    }

    sbar.TextBoxKeyUp = function (e) {

        if (sbar.TextBox.value != "")
            sbar.TipLable.style.display = "none";
        else
            sbar.TipLable.style.display = "";
    }

    sbar.OnSearching = function (e) {

        if (sbar.Searching != undefined)
            sbar.Searching(sbar);

        if (sbar.Command != undefined && sbar.Command != null) {
            sbar.Command.Sender = sbar;
            sbar.Command.Execute();
        }
    }
    

    sbar.OnCreateHandle();
    return sbar;

}

//控件模板
DBFX.Web.Controls.ControlTemplate = function (xtemplate,key,uri) {

    var template = new UIObject("ControlTemplate");
    if (xtemplate == undefined) {
        var xdoc = (new DOMParser()).parseFromString("<Templates></Templates>", "text/xml");
        xtemplate = xdoc.createElement("t");
        xtemplate.setAttribute("Key",key);
        xtemplate.setAttribute("Uri",uri);
    }
    template.XTemplate = xtemplate;
    //模板关键字
    Object.defineProperty(template, "Keyword", {
        get: function () {
            return xtemplate.getAttribute("Key");
        },
        set: function (v) {
            xtemplate.setAttribute("Key", v);
        }
    });
    //模板Uri
    Object.defineProperty(template, "Uri", {
        get: function () {
            return xtemplate.getAttribute("Uri");
        },
        set: function (v) {
            xtemplate.setAttribute("Uri",v);
        }
    });
    //创建列表视图项目
    template.Serializer = new DBFX.Serializer.TemplateSerializer();
    template.CreateUIElement = function (control,cflag) {


        if (control == undefined || control == null) {
            control = new DBFX.Web.Controls.Panel("Template");
        }
        else {

            if(cflag==undefined)
                control.Clear();

        }
        //创建模板
        template.Serializer.DeSerialize(control, template.XTemplate, template.Namespaces);

        return control;

    }

    template.Serialize = function (cp) {

        template.Serializer.Serialize(cp, template.XTemplate, template.Namespaces);

    }


    return template;


}

//扫码按钮
DBFX.Web.Controls.AppSearchBar = function () {

    var asb = new DBFX.Web.Controls.Control("AppSearchBar");
   
    asb.OnCreateHandle = function () {

        asb.VisualElement.innerHTML = "<DIV class=\"AppSearchBarTopMargin\"></DIV><IMG class=\"ScanCodeButtonImage\"  /><DIV class=\"MessengerButton\"><DIV class=\"MessageCounter\"></DIV><IMG class=\"MessageIcon\" /></DIV><DIV class=\"SearchInputBorder\"><IMG class=\"SearchIcon\" ></IMG><DIV class=\"SearchInputDIV\"><INPUT type=\"text\" class=\"SearchTextBox\"></INPUT></DIV></DIV>";
        asb.Class = "AppSearchBar";
        asb.ScanImage = asb.VisualElement.querySelector("IMG.ScanCodeButtonImage");
        asb.ScanImage.src = "themes/" + app.CurrentTheme + "/Images/AppSearchBar/Scancode.png";
        asb.ScanImage.onclick = asb.ScanCode;

        asb.SearchIcon = asb.VisualElement.querySelector("IMG.SearchIcon");
        asb.SearchIcon.src = "themes/" + app.CurrentTheme + "/Images/AppSearchBar/Search.png";

        asb.InputDiv = asb.VisualElement.querySelector("DIV.SearchInputBorder");
        asb.TextBox = asb.VisualElement.querySelector("INPUT.SearchTextBox");
        asb.MessageIcon = asb.VisualElement.querySelector("IMG.MessageIcon");
        asb.MessageIcon.src = "themes/" + app.CurrentTheme + "/Images/AppSearchBar/msg.png";

        asb.MsgCounter = asb.VisualElement.querySelector("DIV.MessageCounter");
        asb.MsgCounter.innerText = "12";
    }

    asb.ScanCode = function (e) {

        try{
            window.QRScan = function (data) {

                asb.TextBox.value = data;

                window.QRScan = undefined;

            }

            Dbsoft.System.Advance.QR.scan("QRScan");

        } catch (ex) {
            alert(ex);
        }

    }



    asb.OnCreateHandle();

    return asb;

}

//条码控件
DBFX.Web.Controls.BarCodeControl = function () {

    var bcc = new DBFX.Web.Controls.Control("BarCodeControl");
    bcc.ClassDescriptor.Serializer = "DBFX.Serializer.BarCodeControlSerializer";
    bcc.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.BarCodeControlDesigner");
    bcc.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.BaseBindingDesigner");
    bcc.VisualElement = document.createElement("DIV");

    bcc.OnCreateHandle();

    //创建句柄
    bcc.OnCreateHandle = function () {

        bcc.Class = "BarCodeControl";
        bcc.VisualElement.innerHTML = "<IMG class=\"BarCodeControl_Image\"></IMG>";
        bcc.barCodeImage = bcc.VisualElement.querySelector("IMG.BarCodeControl_Image");

    }

    //条码类型
    bcc.codeType = "QRCode";
    Object.defineProperty(bcc,"CodeType",{
        get:function()
        {
            return bcc.codeType;
        },
        set:function(v)
        {
            if (bcc.codeType != v) {
                bcc.codeType = v;
                bcc.GetBarCode();
            }
        }
    });

    //条码类型
    bcc.codeWidth = "300px";
    Object.defineProperty(bcc, "CodeWidth", {
        get: function () {
            return bcc.codeWidth;
        },
        set: function (v) {
            bcc.codeWidth = v;

        }
    });

    //条码类型
    bcc.codeHeight = "300px";
    Object.defineProperty(bcc, "CodeHeight", {
        get: function () {
            return bcc.codeHeight;
        },
        set: function (v) {
            bcc.codeHeight = v;

        }
    });
    
    bcc.codeValue = "";
    //数据绑定
    bcc.SetValue = function (v) {

        if (bcc.codeValue == v)
            return;

        bcc.codeValue = v;
        if (v == undefined)
            v = "";

        bcc.GetBarCode();

    }

    bcc.GetValue = function () {
        return bcc.codeValue;
    }

    bcc.GetBarCode = function () {

        bcc.barCodeImage.src = app.BCSvcUri + "?CodeType=" + bcc.codeType + "&Data=" + bcc.codeValue + "&W=" + bcc.codeWidth.replace("px", "") + "&H=" + bcc.codeHeight.replace("px", "");


    }

    bcc.SetText = function (v) {

        if (!bcc.DesignTime) {
            if (typeof v == "string" && v.indexOf("%") >= 0)
                v = app.EnvironVariables.ParsingToString(v);
        }
        bcc.SetValue(v);

    }

    bcc.GetText = function () {

        return bcc.codeValue;

    }
    
    
    bcc.OnCreateHandle();

    return bcc;

}


DBFX.Serializer.BarCodeControlSerializer = function () {


    //反系列化
    this.DeSerialize = function (c, xe, ns) {

   
    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        var xdoc = xe.ownerDocument;
        DBFX.Serializer.SerialProperty("CodeType", c.CodeType, xe);
        DBFX.Serializer.SerialProperty("CodeWidth", c.CodeWidth, xe);
        DBFX.Serializer.SerialProperty("CodeHeight", c.CodeHeight, xe);
        DBFX.Serializer.SerialProperty("Value", c.Value, xe);

    }


}


DBFX.Design.ControlDesigners.BarCodeControlDesigner=function()
{

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {


        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/BarCodeControlDesigner.scrp", function (od) {

            od.DataContext = obdc.dataContext;

        }, obdc);


    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "条码设置";
    return obdc;


}


//表单定时器
DBFX.Web.Controls.FormTimer= function () {

    var formtimer = new DBFX.Web.Controls.Control("FormTimer");
    formtimer.ClassDescriptor.DisplayName = "表单定时器";
    formtimer.ClassDescriptor.Description = "表单定时器，提供定时调用功能";
    formtimer.ClassDescriptor.Serializer = "DBFX.Serializer.FormTimerSerializer";
    formtimer.ClassDescriptor.Designers = ["DBFX.Design.ControlDesigners.ObjectGeneralDesigner", "DBFX.Design.ControlDesigners.FormTimerDesigner"];
    formtimer.ClassDescriptor.DesignTimePreparer = "DBFX.Design.FormTimerDesignTimePreparer";
    formtimer.VisualElement = document.createElement("DIV");

    formtimer.OnCreateHandle();

    //创建句柄
    formtimer.OnCreateHandle = function () {

        formtimer.Class = "FormTimer";

        formtimer.Timer = setTimeout(formtimer.Initalize, 100);

    }

    formtimer.Initalize = function () {

        clearTimeout(formtimer.Timer);
        formtimer.Timer = undefined;

        if (formtimer.DesignTime || formtimer.interval == "-1") {

            if(formtimer.DesignTime)
                formtimer.VisualElement.style.display = "inline-block";

            return;
        }


        formtimer.Start();


    }

    formtimer.Start = function () {

        if (formtimer.Timer != undefined || formtimer.interval < 0)
            return;


        if (formtimer.interval == 0)
            formtimer.Execute();
        else {

            formtimer.Timer = setInterval(formtimer.Execute, formtimer.interval);

        }


    }


    formtimer.Stop = function () {

        if (formtimer.Timer == undefined)
            return;



        if (formtimer.Timer != undefined)
            clearInterval(formtimer.Timer);

        formtimer.Timer = undefined;

    }


    //计时器间隔
    formtimer.interval = "-1";
    Object.defineProperty(formtimer, "Interval", {
        get: function () {
            return formtimer.interval;
        },
        set: function (v) {
            formtimer.interval = v;

        }
    });

    //执行命令
    formtimer.commandName = "";
    Object.defineProperty(formtimer, "CommandName", {
        get: function () {
            return formtimer.commandName;
        },
        set: function (v) {
            formtimer.commandName = v;

        }
    });

    //执行方式
    formtimer.executeMode = 0; //0- 单次 1-重复
    Object.defineProperty(formtimer, "ExecuteMode", {
        get: function () {

            return formtimer.executeMode;

        },
        set: function (v) {

            formtimer.executeMode = v;

        }
    });



    formtimer.Execute = function () {

        try{
            if (formtimer.TimerTick != undefined && formtimer.TimerTick.GetType()=="Command") {
                formtimer.TimerTick.Sender = formtimer;
                formtimer.TimerTick.Execute();
            }
        } catch (ex) {
            clearInterval(formtimer.Timer);
        }
        finally { }

    }

    formtimer.UnLoad = function () {

        if (formtimer.Timer != undefined)
            clearInterval(formtimer.Timer);

    }

    formtimer.SetDisplay = function (v) {

        if (!formtimer.DesignTime)
            formtimer.VisualElement.style.display = "";

    }

    formtimer.OnCreateHandle();

    return formtimer;

}
DBFX.Serializer.FormTimerSerializer = function () {


    //反系列化
    this.DeSerialize = function (c, xe, ns) {


        c.TimerTick = DBFX.Serializer.CommandNameToCmd(xe.getAttribute("CommandName"));
        DBFX.Serializer.DeSerializeCommand("TimerTick", xe, c);


    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        var xdoc = xe.ownerDocument;
        DBFX.Serializer.SerialProperty("Interval", c.Interval, xe);
        DBFX.Serializer.SerialProperty("CommandName", c.CommandName, xe);
        DBFX.Serializer.SerializeCommand("TimerTick", c.TimerTick, xe);

    }


}
DBFX.Design.ControlDesigners.FormTimerDesigner = function () {

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {


        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/FormTimerDesigner.scrp", function (od) {

            od.DataContext = obdc.dataContext;

            od.EventListBox = od.FormContext.Form.FormControls.EventListBox;
            od.EventListBox.ItemSource = [{ EventName: "TimerTick", EventCode: undefined, Command: od.dataContext.TimerTick, Control: od.dataContext }];


        }, obdc);


    }

    obdc.BaseDataBind = obdc.DataBind;
    //
    obdc.DataBind = function (v) {

        if (obdc.EventListBox != undefined)
            obdc.EventListBox.ItemSource = [{ EventName: "TimerTick", EventCode: undefined, Command: obdc.dataContext.TimerTick, Control: obdc.dataContext }];


        obdc.BaseDataBind(v);
    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "定时器设置";
    return obdc;


}
DBFX.Design.FormTimerDesignTimePreparer = function (ftimer, dp) {

    ftimer.VisualElement.appendChild(dp.VisualElement);
    dp.VisualElement.style.left = "0px";
    dp.VisualElement.style.top = "0px";
    dp.VisualElement.style.bottom = "0px";
    dp.VisualElement.style.right = "0px";
    ftimer.DesignTime = true;
    ftimer.VisualElement.style.display = "inline-block";
}

//消息监听器
DBFX.Web.Controls.NotificationWatcher = function () {

    var nwatcher = new DBFX.Web.Controls.Control("NotificationWatcher");
    nwatcher.ClassDescriptor.DisplayName = "消息监听器";
    nwatcher.ClassDescriptor.Description = "监听指定类型的消息信息";
    nwatcher.ClassDescriptor.Serializer = "DBFX.Serializer.NotificationWatcherSerializer";
    nwatcher.ClassDescriptor.Designers = ["DBFX.Design.ControlDesigners.ObjectGeneralDesigner", "DBFX.Design.ControlDesigners.NotificationWatcherDesigner"];
    nwatcher.ClassDescriptor.DesignTimePreparer = "DBFX.Design.NotificationWatcherDesignTimePreparer";
    nwatcher.VisualElement = document.createElement("DIV");

    nwatcher.OnCreateHandle();

    //创建句柄
    nwatcher.OnCreateHandle = function () {

        nwatcher.Class = "NotificationWatcher";

    }

    //加载控件
    nwatcher.OnLoad = function () {

        //注册UDP消息监听器


        //执行初始化程序
        if (nwatcher.WatcherOnLoad != undefined && nwatcher.WatcherOnLoad.GetType() == "Command") {

            nwatcher.WatcherOnLoad.Sender=nwatcher;
            nwatcher.WatcherOnLoad.Execute();

            nwatcher.WatchFilter = { MsgTypes: nwatcher.msgTypes, MsgCallback: nwatcher.OnMsg };

            app.Notifications.AddFilter(nwatcher.WatchFilter);

        }

    }


    nwatcher.OnMsg = function (m) {

        //alert("OnMSG:"+JSON.stringify(m));
        
        //消息回调方法
        if (nwatcher.WatcherOnMsg != undefined && nwatcher.WatcherOnMsg.GetType() == "Command") {
            nwatcher.MsgObject = m;
            nwatcher.WatcherOnMsg.Sender = nwatcher;
            nwatcher.WatcherOnMsg.Execute();

        }

    }

    //卸载控件
    nwatcher.UnLoad = function () {

        //注销消息监听器

        if(nwatcher.WatchFilter!=undefined)
            app.Notifications.RemoveFilter(nwatcher.WatchFilter);

        //执行卸载程序
        if (nwatcher.WatcherUnLoad != undefined && nwatcher.WatcherUnLoad.GetType() == "Command") {


            nwatcher.WatcherUnLoad.Sender = nwatcher;
            nwatcher.WatcherUnLoad.Execute();

        }

    }

    nwatcher.msgTypes = "";
    Object.defineProperty(nwatcher, "MsgTypes", {
        get: function () {

            return nwatcher.msgTypes;

        },
        set: function (v) {

            nwatcher.msgTypes = v;

        }
    });


    //设置显示方式
    nwatcher.SetDisplay = function (v) {

        if (!nwatcher.DesignTime)
            nwatcher.VisualElement.style.display = "";

    }

    nwatcher.OnCreateHandle();

    return nwatcher;

}
DBFX.Serializer.NotificationWatcherSerializer = function () {


    //反系列化
    this.DeSerialize = function (c, xe, ns) {

        DBFX.Serializer.DeSerializeCommand("WatcherOnLoad", xe, c);
        DBFX.Serializer.DeSerializeCommand("WatcherOnMsg", xe, c);
        DBFX.Serializer.DeSerializeCommand("WatcherUnLoad", xe, c);

    }


    //系列化
    this.Serialize = function (c, xe, ns) {

        var xdoc = xe.ownerDocument;
        DBFX.Serializer.SerialProperty("MsgTypes", c.MsgTypes, xe);
        DBFX.Serializer.SerialProperty("CommandName", c.CommandName, xe);
        DBFX.Serializer.SerializeCommand("WatcherOnLoad", c.WatcherOnLoad, xe);
        DBFX.Serializer.SerializeCommand("WatcherOnMsg", c.WatcherOnMsg, xe);
        DBFX.Serializer.SerializeCommand("WatcherUnLoad", c.WatcherUnLoad, xe);
    }


}
DBFX.Design.ControlDesigners.NotificationWatcherDesigner = function () {

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {


        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/NotificationWatcherDesigner.scrp", function (od) {

            od.DataContext = obdc.dataContext;
            od.EventListBox = od.FormContext.Form.FormControls.EventListBox;
            od.EventListBox.ItemSource = [{ EventName: "WatcherOnLoad", EventCode: undefined, Command: od.dataContext.WatcherOnLoad, Control: od.dataContext }, { EventName: "WatcherOnMsg", EventCode: undefined, Command: od.dataContext.WatcherOnMsg, Control: od.dataContext }, { EventName: "WatcherUnLoad", EventCode: undefined, Command: obdc.dataContext.WatcherUnLoad, Control: obdc.dataContext }];


        }, obdc);


    }

    obdc.BaseDataBind = obdc.DataBind;
    //
    obdc.DataBind = function (v) {

        if (obdc.EventListBox != undefined)
            obdc.EventListBox.ItemSource = [{ EventName: "WatcherOnLoad", EventCode: undefined, Command: obdc.dataContext.WatcherOnLoad, Control: obdc.dataContext }, { EventName: "WatcherOnMsg", EventCode: undefined, Command: obdc.dataContext.WatcherOnMsg, Control: obdc.dataContext }, { EventName: "WatcherUnLoad", EventCode: undefined, Command: obdc.dataContext.WatcherUnLoad, Control: obdc.dataContext }];


        obdc.BaseDataBind(v);
    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "消息监听器设置";
    return obdc;


}
DBFX.Design.NotificationWatcherDesignTimePreparer = function (ftimer, dp) {

    ftimer.VisualElement.appendChild(dp.VisualElement);
    dp.VisualElement.style.left = "0px";
    dp.VisualElement.style.top = "0px";
    dp.VisualElement.style.bottom = "0px";
    dp.VisualElement.style.right = "0px";
    ftimer.DesignTime = true;
    ftimer.VisualElement.style.display = "inline-block";
}


//表单定时器
DBFX.Web.Controls.RichTextBlock = function () {

    var rtbBox = new DBFX.Web.Controls.Control("RichTextBlock");
    rtbBox.ClassDescriptor.DisplayName = "富文本显示框";
    rtbBox.ClassDescriptor.Description = "显示HTML文本内容";
    rtbBox.ClassDescriptor.Serializer = "DBFX.Serializer.LabelBoxSerializer";
    rtbBox.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.LabelControlDesigner");
    rtbBox.VisualElement = document.createElement("DIV");

    rtbBox.OnCreateHandle();

    //创建句柄
    rtbBox.OnCreateHandle = function () {

        rtbBox.Class = "RichTextBlock";
        rtbBox.VisualElement.innerHTML = "<DIV class=\"RichTextBlockDIV\"></DIV>";
        rtbBox.RtbDiv = rtbBox.VisualElement.querySelector("DIV.RichTextBlockDIV");
    }

    rtbBox.SetText = function (v) {

        rtbBox.RtbDiv.innerHTML = v;

    }

    rtbBox.SetValue = function (v) {

        rtbBox.RtbDiv.innerHTML = v;

    }

    rtbBox.OnCreateHandle();

    return rtbBox;

}

//水平滚动条
DBFX.Web.Controls.HorizonScrollBar = function () {

    var hscb = new UIObject("HorizonScrollBar");
    hscb.VisualElement = document.createElement("DIV");
    hscb.OnCreateHandle();
    hscb.VisualElement.className = "HorizonScrollBar";
    hscb.VisualElement.innerHTML = "<DIV class=\"HSCB_LArrowDiv\"></DIV><DIV class=\"HSCB_TrackBar\"></DIV><DIV class=\"HSCB_RArrowDiv\"></DIV>";

    hscb.VisualElement.draggable = false;

    hscb.LArrow = hscb.VisualElement.querySelector("DIV.HSCB_LArrowDiv");
    hscb.LArrow.draggable = false;

    hscb.Tracker = hscb.VisualElement.querySelector("DIV.HSCB_TrackBar");
    hscb.Tracker.draggable = false;

    hscb.RArrow = hscb.VisualElement.querySelector("DIV.HSCB_RArrowDiv");
    hscb.RArrow.draggable = false;

    //处理点击事件
    hscb.VisualElement.onmousedown = function (e) {
        e.preventDefault();
        e.cancelBubble = true;
        //向左的按钮
        if (e.srcElement == hscb.LArrow) {


        }

        //向右的按钮
        if (e.srcElement == hscb.RArrow) {


        }

        //位置滑块
        if (e.srcElement == hscb.Tracker) {

            hscb.CP = { l: hscb.Tracker.offsetLeft, x: e.clientX };
            document.onmousemove = hscb.DocumentMouseMove;
            document.onmouseup = hscb.DocumentOnMouseUp;
        }

    }

    hscb.VisualElement.onmousewheel = function (e) {

        var hinc = e.wheelDelta / 10;
        var nx = (hscb.Tracker.offsetLeft - hinc);

        if (nx < hscb.LArrow.clientWidth)
            nx = hscb.LArrow.clientWidth;

        if (nx > hscb.RArrow.offsetLeft - hscb.Tracker.clientWidth)
            nx = hscb.RArrow.offsetLeft - hscb.Tracker.clientWidth;


        hscb.Tracker.style.left = nx + "px";
    }

    hscb.DocumentOnMouseUp = function (e) {


        e.preventDefault();
        e.cancelBubble = true;

        //取消全局鼠标移动事件跟踪
        if (document.onmousemove == hscb.DocumentMouseMove)
            document.onmousemove = undefined;

    }

    //
    hscb.DocumentMouseMove = function (e) {

        var hinc = e.clientX - hscb.CP.x;
        var nx = hscb.CP.l + hinc;

        if (nx < hscb.LArrow.clientWidth)
            nx = hscb.LArrow.clientWidth;

        if (nx > hscb.RArrow.offsetLeft - hscb.Tracker.clientWidth)
            nx = hscb.RArrow.offsetLeft - hscb.Tracker.clientWidth;

        hscb.Tracker.style.left = nx + "px";

    }



    return hscb;

}


//垂直滚动条
DBFX.Web.Controls.VerticalScrollBar = function () {

    var vscb = UIObject("VerticalScrollBar");
    vscb.VisualElement = document.createElement("DIV");
    vscb.OnCreateHandle();
    vscb.VisualElement.className = "VerticalScrollBar";
    vscb.VisualElement.innerHTML = "<DIV class=\"VSCB_TArrowDiv\"></DIV><DIV class=\"VSCB_TrackBar\"></DIV><DIV class=\"VSCB_BArrowDiv\"></DIV>";

    vscb.VisualElement.draggable = false;

    vscb.TArrow = vscb.VisualElement.querySelector("DIV.VSCB_TArrowDiv");
    vscb.TArrow.draggable = false;

    vscb.Tracker = vscb.VisualElement.querySelector("DIV.VSCB_TrackBar");
    vscb.Tracker.draggable = false;

    vscb.BArrow = vscb.VisualElement.querySelector("DIV.VSCB_BArrowDiv");
    vscb.BArrow.draggable = false;

    //处理点击事件
    vscb.VisualElement.onmousedown = function (e) {
        e.preventDefault();
        e.cancelBubble = true;
        //向左的按钮
        if (e.srcElement == vscb.TArrow) {


        }

        //向右的按钮
        if (e.srcElement == vscb.BArrow) {


        }

        //位置滑块
        if (e.srcElement == vscb.Tracker) {

            vscb.CP = { t: vscb.Tracker.offsetTop, x: e.clientY };
            document.onmousemove = vscb.DocumentMouseMove;
            document.onmouseup = vscb.DocumentOnMouseUp;
        }

    }


    vscb.VisualElement.onmousewheel = function (e) {
        e.preventDefault();
        e.cancelBubble = true;
        var vinc = e.wheelDelta / 10;
        var ny = (vscb.Tracker.offsetTop - vinc);

        if (ny < vscb.TArrow.clientHeight)
            ny = vscb.TArrow.clientHeight;

        if (ny > vscb.BArrow.offsetTop - vscb.Tracker.clientHeight)
            ny = vscb.BArrow.offsetTop - vscb.Tracker.clientHeight;


        vscb.Tracker.style.top = ny + "px";
    }


    vscb.DocumentOnMouseUp = function (e) {


        e.preventDefault();
        e.cancelBubble = true;

        //取消全局鼠标移动事件跟踪
        if (document.onmousemove == vscb.DocumentMouseMove)
            document.onmousemove = undefined;

    }

    //
    vscb.DocumentMouseMove = function (e) {

        var vinc = e.clientY - vscb.CP.y;
        var ny = vscb.CP.l + hinc;

        if (ny < vscb.TArrow.clientHeight)
            ny = vscb.TArrow.clientHeight;

        if (ny > vscb.BArrow.offsetTop - vscb.Tracker.clientHeight)
            ny = vscb.BArrow.offsetTop - vscb.Tracker.clientHeight;

        vscb.Tracker.style.top = ny + "px";

    }



    return vscb;

}

DBFX.Web.Controls.DateTimePicker = function () {

    var ds = DBFX.Web.Controls.Control("DateTimePicker");

    ds.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.DateTimePickerDesigner");
    ds.ClassDescriptor.Serializer = "DBFX.Serializer.DateTimePickerSerializer";

    //默认配置
    ds.defaults =  //Plugin Defaults
    {
        mode: "date",
        defaultDate: null,

        dateSeparator: "-",
        timeSeparator: ":",
        timeMeridiemSeparator: " ",
        dateTimeSeparator: " ",
        monthYearSeparator: " ",

        dateTimeFormat: "dd-MM-yyyy HH:mm",
        dateFormat: "dd-MM-yyyy",
        timeFormat: "HH:mm",

        maxDate: null,
        minDate: null,

        maxTime: null,
        minTime: null,

        maxDateTime: null,
        minDateTime: null,


        shortDayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        fullDayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        shortMonthNames: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        fullMonthNames: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        labels: null, /*{"year": "Year", "month": "Month", "day": "Day", "hour": "Hour", "minutes": "Minutes", "seconds": "Seconds", "meridiem": "Meridiem"}*/

        minuteInterval: 1,
        roundOffMinutes: true,

        secondsInterval: 1,
        roundOffSeconds: true,

        titleContentDate: "设置日期",
        titleContentTime: "设置时间",
        titleContentDateTime: "设置日期 & 时间",

        buttonsToDisplay: ["HeaderCloseButton", "SetButton", "ClearButton"],
        setButtonContent: "确定",
        clearButtonContent: "取消",
        incrementButtonContent: "+",
        decrementButtonContent: "-",
        setValueInTextboxOnEveryClick: false,

        animationDuration: 400,

        isPopup: true,
        parentElement: "body",

        language: "",

        init: null, // init(oDateTimePicker)
        addEventHandlers: null,  // addEventHandlers(oDateTimePicker)
        beforeShow: null,  // beforeShow(oInputElement)
        afterShow: null,  // afterShow(oInputElement)
        beforeHide: null,  // beforeHide(oInputElement)
        afterHide: null,  // afterHide(oInputElement)
        buttonClicked: null,  // buttonClicked(sButtonType, oInputElement) where sButtonType = "SET"|"CLEAR"|"CANCEL"|"TAB"
        settingValueOfElement: null, // settingValueOfElement(sValue, dDateTime, oInputElement)
        formatHumanDate: null,  // formatHumanDate(oDateTime, sMode, sFormat)

        parseDateTimeString: null, // parseDateTimeString(sDateTime, sMode, oInputField)
        formatDateTimeString: null // formatDateTimeString(oDateTime, sMode, oInputField)
    };

    //临时变量 用来计算详细的时间控件实例
    ds.dataObject = // Temporary Variables For Calculation Specific to DateTimePicker Instance
    {
        dCurrentDate: new Date(),
        iCurrentDay: 0,
        iCurrentMonth: 0,
        iCurrentYear: 0,
        iCurrentHour: 0,
        iCurrentMinutes: 0,
        iCurrentSeconds: 0,
        sCurrentMeridiem: "",
        iMaxNumberOfDays: 0,

        sDateFormat: "",
        sTimeFormat: "",
        sDateTimeFormat: "",

        dMinValue: null,
        dMaxValue: null,

        sArrInputDateFormats: [],
        sArrInputTimeFormats: [],
        sArrInputDateTimeFormats: [],

        bArrMatchFormat: [],
        bDateMode: false,
        bTimeMode: false,
        bDateTimeMode: false,

        oInputElement: null,

        iTabIndex: 0,
        bElemFocused: false,
        bIs12Hour: false
    };


    ds.VisualElement = document.createElement("DIV");
    ds.OnCreateHandle();

    // console.log(ds.VisualElement);
    // document.body.appendChild(ds.VisualElement);

    //初始化当前日期
    // ds.currentDate = new Date();
    ds.currentDate = "2018-05-14 00:00:00";
    Object.defineProperty(ds, "CurrentDate", {
        get: function () {
            return ds.currentDate;
        },
        set: function (v) {
            ds.currentDate = v;
        }
    });

    //设置选择控件的类型 date/time/dateAndTime
    ds.type = 'dateAndTime';
    Object.defineProperty(ds, "PickerType", {
        get: function () {
            return ds.type;
        },
        set: function (v) {
            ds.type = v;
            // ds.oncreate();
            var nodes = ds.VisualElement.childNodes;
            var count = nodes.length;

            //FIXME:平台判断和这里不是一样的条件 平台是大于2  这里要大于等于2
            if (count >= 2) {
                //清除掉原来的控件
                ds.VisualElement.removeChild(nodes[count - 1]);
            }
            ds.contentLabel.innerText = ds.getDisplayDateStr(ds.currentDate);
            ds.loaded();
        }
    });

    //显示字体
    ds.textFontFamily = "PingFang SC";
    Object.defineProperty(ds, "TextFontFamily", {
        get: function () {
            return ds.textFontFamily;
        },
        set: function (v) {
            ds.textFontFamily = v;
        }
    });
    //
    ds.titleColor = '#2980B9';
    Object.defineProperty(ds, "TitleColor", {
        get: function () {
            return ds.titleColor;
        },
        set: function (v) {
            ds.titleColor = v;
        }
    });

    ds.titleFontsize = 16;
    Object.defineProperty(ds, "TitleFontsize", {
        get: function () {
            return ds.titleFontsize;
        },
        set: function (v) {
            ds.titleFontsize = v;
        }
    });

    ds.dateLabelColor = '#666666';
    Object.defineProperty(ds, "DateLabelColor", {
        get: function () {
            return ds.dateLabelColor;
        },
        set: function (v) {
            ds.dateLabelColor = v;
        }
    });

    ds.dateLabelFontsize = 17;
    Object.defineProperty(ds, "DateLabelFontsize", {
        get: function () {
            return ds.dateLabelFontsize;
        },
        set: function (v) {
            ds.dateLabelFontsize = v;
        }
    });

    ds.btnFontsize = 16;
    Object.defineProperty(ds, "BtnFontsize", {
        get: function () {
            return ds.btnFontsize;
        },
        set: function (v) {
            ds.btnFontsize = v;
        }
    });

    ds.ensureBtnFontColor = '#666666';
    Object.defineProperty(ds, "EnsureBtnFontColor", {
        get: function () {
            return ds.ensureBtnFontColor;
        },
        set: function (v) {
            ds.ensureBtnFontColor = v;
        }
    });

    ds.cancelBtnFontColor = '#666666';
    Object.defineProperty(ds, "CancelBtnFontColor", {
        get: function () {
            return ds.cancelBtnFontColor;
        },
        set: function (v) {
            ds.cancelBtnFontColor = v;
        }
    });


    //调节区域背景颜色
    ds.comBgColor = '#FFFFFF';
    Object.defineProperty(ds, "ComBgColor", {
        get: function () {
            return ds.comBgColor;
        },
        set: function (v) {
            ds.comBgColor = v;
        }
    });
    //头部背景色
    ds.headerBgColor = '#CBCBCB';
    Object.defineProperty(ds, "HeaderBgColor", {
        get: function () {
            return ds.headerBgColor;
        },
        set: function (v) {
            ds.headerBgColor = v;
        }
    });
    //确认按钮背景色
    ds.ensureBtnBgColor = 'transparent';
    Object.defineProperty(ds, "EnsureBtnBgColor", {
        get: function () {
            return ds.ensureBtnBgColor;
        },
        set: function (v) {
            ds.ensureBtnBgColor = v;
        }
    });
    //取消按钮背景色
    ds.cancelBtnBgColor = 'transparent';
    Object.defineProperty(ds, "CancelBtnBgColor", {
        get: function () {
            return ds.cancelBtnBgColor;
        },
        set: function (v) {
            ds.cancelBtnBgColor = v;
        }
    });



    //边框样式
    ds.borderColor = "#cbcbcb";
    Object.defineProperty(ds, "Border_Color", {
        get: function () {
            return ds.borderColor;
        },
        set: function (v) {
            ds.borderColor = v;
        }
    });

    ds.borderWidth = 1;
    Object.defineProperty(ds, "Border_Width", {
        get: function () {
            return ds.borderWidth;
        },
        set: function (v) {
            ds.borderWidth = v;
        }
    });

    ds.borderRadius = 0;
    Object.defineProperty(ds, "Border_Radius", {
        get: function () {
            return ds.borderRadius;
        },
        set: function (v) {
            ds.borderRadius = v;
        }
    });



    //保存年、月、日、时、分 显示的控件
    //{year: ,month: ,day: ,hour: ,minutes: ,seconds: }
    ds.tempDate = {};

    //选中的日期-Date对象
    ds.selectDate = {};

    ds.init = function () {
        var oDTP = ds;

        if (oDTP.settings.isPopup) {
            oDTP.createPicker();
            // $(oDTP.element).addClass("dtpicker-mobile");

            switch (ds.type) {
                case "date":
                    ds.createDateComponent();
                    break;
                case "time":
                    ds.createTimeComponent();
                    break;
                case "dateAndTime":
                    ds.createDateTimeComponent();
                    break;
                default:
                    break;
            }

        }

        if (oDTP.settings.init)
            oDTP.settings.init.call(oDTP);
        //
        // oDTP._addEventHandlersForInput();
    }

    //创建控件的整体
    ds.createPicker = function () {
        //标签显示的时间
        var title;
        var timeLabel;

        switch (ds.type) {
            case "date":
                title = "设置日期";
                break;
            case "time":
                title = "设置时间";
                break;
            case "dateAndTime":
                title = "设置日期和时间";
                break;
            default:
                break;
        }

        timeLabel = ds.getDisplayDateStr(ds.currentDate);


        var sTempStr = "";
        // sTempStr += "<div  id='dtBox' class='dtpicker-overlay dtpicker-mobile'>";
        sTempStr += "<div  id='dtBox' class='dtpicker-overlay'>";
        sTempStr += "<div class='dtpicker-bg'>";
        sTempStr += "<div class='dtpicker-cont'>";
        sTempStr += "<div class='dtpicker-content'>";
        sTempStr += "<div class='dtpicker-subcontent'>";

        //控件头 标题 显示选中的时间
        sTempStr += "<div class='dtpicker-header'>";
        sTempStr += "<div class='dtpicker-title'>" + title + "</div>";
        sTempStr += "<a class='dtpicker-close'>×</a>";
        sTempStr += "<div class='dtpicker-value'>" + timeLabel + "</div>";
        sTempStr += "</div>";

        //控件主题选择器
        sTempStr += "<div class='dtpicker-components'>";
        sTempStr += "</div>";

        //按钮布局
        sTempStr += "<div class='dtpicker-buttonCont dtpicker-twoButtons'>";
        sTempStr += "<a class='dtpicker-button dtpicker-buttonSet'>" + "确定" + "</a>";
        sTempStr += "<a class='dtpicker-button dtpicker-buttonClear'>" + "取消" + "</a>";
        sTempStr += "</div>";


        sTempStr += "</div>";
        sTempStr += "</div>";
        sTempStr += "</div>";
        sTempStr += "</div>";
        sTempStr += "</div>";

        var div = document.createElement('div');
        div.innerHTML = sTempStr;
        // ds.VisualElement.innerHTML = sTempStr;

        ds.VisualElement.appendChild(div);

    }

    //创建日期选择控件Date
    ds.createDateComponent = function () {

        //年
        var yearCom = ds.createComponent();
        yearCom.classList.add('dtpicker-comp3');
        yearCom.querySelector('.dtpicker-comp').classList.add('year');
        yearCom.querySelector('.dtpicker-compValue').value = ds.handleDateStr(ds.currentDate).getFullYear();
        ds.tempDate.year = yearCom.querySelector('.dtpicker-compValue');
        //月
        var monthCom = ds.createComponent();
        monthCom.classList.add('dtpicker-comp3');
        monthCom.querySelector('.dtpicker-comp').classList.add('month');
        monthCom.querySelector('.dtpicker-compValue').value = ds.handleDateStr(ds.currentDate).getMonth();
        ds.tempDate.month = monthCom.querySelector('.dtpicker-compValue');
        //日
        var dayCom = ds.createComponent();
        dayCom.classList.add('dtpicker-comp3');
        dayCom.querySelector('.dtpicker-comp').classList.add('day');
        dayCom.querySelector('.dtpicker-compValue').value = ds.handleDateStr(ds.currentDate).getDate();
        ds.tempDate.day = dayCom.querySelector('.dtpicker-compValue');


        ds.VisualElement.querySelector('.dtpicker-components').appendChild(yearCom);
        ds.VisualElement.querySelector('.dtpicker-components').appendChild(monthCom);
        ds.VisualElement.querySelector('.dtpicker-components').appendChild(dayCom);
        // console.log(yearCom);
    }

    //创建时间选择控件Time
    ds.createTimeComponent = function () {
        //时
        var hourCom = ds.createComponent();
        hourCom.classList.add('dtpicker-comp3');
        hourCom.querySelector('.dtpicker-comp').classList.add('hour');
        hourCom.querySelector('.dtpicker-compValue').value = ds.handleDateStr(ds.currentDate).getHours() + "时";
        ds.tempDate.hour = hourCom.querySelector('.dtpicker-compValue');
        //分
        var minutesCom = ds.createComponent();
        minutesCom.classList.add('dtpicker-comp3');
        minutesCom.querySelector('.dtpicker-comp').classList.add('minutes');
        minutesCom.querySelector('.dtpicker-compValue').value = ds.handleDateStr(ds.currentDate).getMinutes() + "分";
        ds.tempDate.minutes = minutesCom.querySelector('.dtpicker-compValue');
        //秒
        var secondsCom = ds.createComponent();
        secondsCom.classList.add('dtpicker-comp3');
        secondsCom.querySelector('.dtpicker-comp').classList.add('seconds');
        secondsCom.querySelector('.dtpicker-compValue').value = ds.handleDateStr(ds.currentDate).getSeconds() + "秒";
        ds.tempDate.seconds = secondsCom.querySelector('.dtpicker-compValue');

        ds.VisualElement.querySelector('.dtpicker-components').appendChild(hourCom);
        ds.VisualElement.querySelector('.dtpicker-components').appendChild(minutesCom);
        ds.VisualElement.querySelector('.dtpicker-components').appendChild(secondsCom);

    }


    //创建日期&时间选择控件dateAndTime
    ds.createDateTimeComponent = function () {
        //年
        var yearCom = ds.createComponent();
        yearCom.classList.add('dtpicker-comp5');
        yearCom.querySelector('.dtpicker-comp').classList.add('year');
        yearCom.querySelector('.dtpicker-compValue').value = ds.handleDateStr(ds.currentDate).getFullYear();
        ds.tempDate.year = yearCom.querySelector('.dtpicker-compValue');
        //月
        var monthCom = ds.createComponent();
        monthCom.classList.add('dtpicker-comp5');
        monthCom.querySelector('.dtpicker-comp').classList.add('month');
        monthCom.querySelector('.dtpicker-compValue').value = ds.handleDateStr(ds.currentDate).getMonth();
        ds.tempDate.month = monthCom.querySelector('.dtpicker-compValue');
        //日
        var dayCom = ds.createComponent();
        dayCom.classList.add('dtpicker-comp5');
        dayCom.querySelector('.dtpicker-comp').classList.add('day');
        dayCom.querySelector('.dtpicker-compValue').value = ds.handleDateStr(ds.currentDate).getDate();
        ds.tempDate.day = dayCom.querySelector('.dtpicker-compValue');
        //时
        var hourCom = ds.createComponent();
        hourCom.classList.add('dtpicker-comp5');
        hourCom.querySelector('.dtpicker-comp').classList.add('hour');
        hourCom.querySelector('.dtpicker-compValue').value = ds.handleDateStr(ds.currentDate).getHours() + "时";
        ds.tempDate.hour = hourCom.querySelector('.dtpicker-compValue');
        //分
        var minutesCom = ds.createComponent();
        minutesCom.classList.add('dtpicker-comp5');
        minutesCom.querySelector('.dtpicker-comp').classList.add('minutes');
        minutesCom.querySelector('.dtpicker-compValue').value = ds.handleDateStr(ds.currentDate).getMinutes() + "分";
        ds.tempDate.minutes = minutesCom.querySelector('.dtpicker-compValue');


        ds.VisualElement.querySelector('.dtpicker-components').appendChild(yearCom);
        ds.VisualElement.querySelector('.dtpicker-components').appendChild(monthCom);
        ds.VisualElement.querySelector('.dtpicker-components').appendChild(dayCom);
        ds.VisualElement.querySelector('.dtpicker-components').appendChild(hourCom);
        ds.VisualElement.querySelector('.dtpicker-components').appendChild(minutesCom);

    }


    //创建单个选择组件
    ds.createComponent = function () {
        var innerStr = "";
        var component = document.createElement('div');
        component.classList.add('dtpicker-compOutline');
        innerStr += "<div class='dtpicker-comp'>";
        innerStr += "<a class=\"dtpicker-compButton increment dtpicker-compButtonEnable\">+</a>";
        innerStr += "<input type=\"text\" class=\"dtpicker-compValue\">";
        innerStr += "<a class=\"dtpicker-compButton decrement dtpicker-compButtonEnable\">-</a>";
        innerStr += "</div>";
        component.innerHTML = innerStr;

        component.querySelector(".increment").addEventListener('mousedown', function () {
            // console.log(this.parentNode);
            ds.handleIncrementBtnClick(event, this);
        }, false);

        component.querySelector(".decrement").addEventListener('mousedown', function () {
            // console.log(this.parentNode);
            ds.handleDecrementBtnClick(event, this);
        }, false);

        var incrementE = component.querySelector('.increment');
        var decrementE = component.querySelector(".decrement");
        // incrementE.style.border = "1px solid red";
        // decrementE.style.border = "1px solid red";
        // incrementE.style.borderRadius = '8px';
        // console.log(incrementE);

        return component;
    }

    //更新所有显示的数值
    ds.updateValues = function () {
        ds.valueLabel.innerText = ds.handleDate(ds.tempDate);

    }

    //处理日期字符串xxxx-xx-xx xx:xx:xx，转成日期对象
    ds.handleDateStr = function (dateStr) {
        var timeArr = dateStr.split(' ');
        var dates = timeArr[0].split('-');
        var times = timeArr[1].split(':');
        var y, m, d, h, mi, sec;
        y = dates[0];
        m = dates[1];
        d = dates[2];
        h = times[0];
        mi = times[1];
        sec = times[2];
        return new Date(y, m, d, h, mi, sec);
    }

    ds.handleDate = function (dateObj) {
        //创建变动的日期
        var tempD;
        switch (ds.type) {
            case "date":
                tempD = new Date(dateObj.year.value, dateObj.month.value - 1, dateObj.day.value);
                break;
            case "time":

                tempD = new Date(ds.handleDateStr(ds.currentDate).getFullYear(), ds.handleDateStr(ds.currentDate).getMonth(), ds.handleDateStr(ds.currentDate).getDate(),
                    parseInt(dateObj.hour.value), parseInt(dateObj.minutes.value), parseInt(dateObj.seconds.value));
                break;
            case "dateAndTime":
                tempD = new Date(dateObj.year.value, dateObj.month.value - 1, dateObj.day.value,
                    parseInt(dateObj.hour.value), parseInt(dateObj.minutes.value));
                break;
            default:
                break;
        }

        // console.log(tempD);
        var y = tempD.getFullYear(),
            m = tempD.getMonth() + 1,
            d = tempD.getDate(),
            h = tempD.getHours(),
            mi = tempD.getMinutes(),
            sec = tempD.getSeconds(),
            week = tempD.getDay();

        // console.log(ds.defaults.shortDayNames[week]);

        var showText;
        switch (ds.type) {
            case "date":
                dateObj.year.value = y;
                dateObj.month.value = m;
                dateObj.day.value = d;
                showText = y + ds.defaults.dateSeparator + m + ds.defaults.dateSeparator + d;//+ds.defaults.dateSeparator+ds.defaults.shortDayNames[week];
                break;
            case "time":
                var minutes = '' + mi,
                    seconds = '' + sec;

                mi = minutes.length == 2 ? mi : '0' + mi;
                sec = seconds.length == 2 ? sec : '0' + sec;

                dateObj.hour.value = h + "时";
                dateObj.minutes.value = mi + "分";
                dateObj.seconds.value = sec + "秒";
                showText = h + ds.defaults.timeSeparator + mi + ds.defaults.timeSeparator + sec;

                break;
            case "dateAndTime":
                dateObj.year.value = y;
                dateObj.month.value = m;
                dateObj.day.value = d;

                var minutes = '' + mi,
                    seconds = '' + sec;

                mi = minutes.length == 2 ? mi : '0' + mi;
                sec = seconds.length == 2 ? sec : '0' + sec;

                dateObj.hour.value = h + "时";
                dateObj.minutes.value = mi + "分";

                //显示周：ds.defaults.dateSeparator+ds.defaults.shortDayNames[week]
                showText = y + ds.defaults.dateSeparator + m + ds.defaults.dateSeparator + d + " "
                    + h + ds.defaults.timeSeparator + mi;

                break;
            default:
                break;
        }

        return showText;
    }

    //获取时间显示字符串
    ds.getDisplayDateStr = function (date) {

        var y, m, d, h, mi, sec, week;
        if (date instanceof Date) {

            y = date.getFullYear();
            m = date.getMonth() + 1;
            d = date.getDate();
            h = date.getHours();
            mi = date.getMinutes();
            sec = date.getSeconds();
            week = date.getDay();

        } else {//xxxx-xx-xx xx:xx:xx
            var timeArr = date.split(' ');
            var dates = timeArr[0].split('-');
            var times = timeArr[1].split(':');
            y = dates[0];
            m = dates[1];
            d = dates[2];
            h = times[0];
            mi = times[1];
            sec = times[2];
        }


        var showText;
        switch (ds.type) {
            case "date":
                showText = y + ds.defaults.dateSeparator + m + ds.defaults.dateSeparator + d;//+ds.defaults.dateSeparator+ds.defaults.shortDayNames[week];
                break;
            case "time":
                var minutes = '' + mi,
                    seconds = '' + sec;

                mi = minutes.length == 2 ? mi : '0' + mi;
                sec = seconds.length == 2 ? sec : '0' + sec;
                showText = h + ds.defaults.timeSeparator + mi + ds.defaults.timeSeparator + sec;
                break;
            case "dateAndTime":

                var minutes = '' + mi,
                    seconds = '' + sec;

                mi = minutes.length == 2 ? mi : '0' + mi;
                sec = seconds.length == 2 ? sec : '0' + sec;

                //显示周：ds.defaults.dateSeparator+ds.defaults.shortDayNames[week]
                showText = y + ds.defaults.dateSeparator + m + ds.defaults.dateSeparator + d + " "
                    + h + ds.defaults.timeSeparator + mi;
                break;
            default:
                break;
        }

        return showText;

    }

    //处理'+'点击事件
    ds.handleIncrementBtnClick = function (event, element) {
        var ev = event || window.event;
        var parentN = element.parentNode;
        // console.log(parentN.classList.contains('day'));

        var label = parentN.querySelector('.dtpicker-compValue');
        label.value = parseInt(label.value) + 1;

        //更新显示的数值
        ds.updateValues();
    }

    //处理'-'点击事件
    ds.handleDecrementBtnClick = function (event, element) {
        var ev = event || window.event;
        var parentN = element.parentNode;
        // console.log(parentN.childNodes);
        var label = parentN.querySelector('.dtpicker-compValue');
        label.value = parseInt(label.value) - 1;

        //更新显示的数值
        ds.updateValues();
    }

    //获取元素的实例对象
    ds.getElementInstance = function () {
        //控件页面整体
        // ds.dtBox = document.getElementById('dtBox');
        ds.dtBox = ds.VisualElement.querySelector('.dtpicker-overlay');
        //背景
        ds.bg = ds.dtBox.querySelector('.dtpicker-bg');
        //获取选择控件整体
        ds.content = ds.dtBox.querySelector('.dtpicker-content');
        //获取subcontent
        ds.subcontent = ds.dtBox.querySelector('.subcontent');
        //获取控件头部整体
        ds.header = ds.dtBox.querySelector('.dtpicker-header');
        //获取标题显示div
        ds.titleE = ds.dtBox.querySelector('.dtpicker-title');
        //获取右上角关闭按钮
        ds.closeBtn = ds.dtBox.querySelector('.dtpicker-close');
        //获取显示日期标签
        ds.valueLabel = ds.dtBox.querySelector('.dtpicker-value');
        //取消按钮和确定按钮整体
        ds.buttonCont = ds.dtBox.querySelector('.dtpicker-buttonCont');
        //确定按钮
        ds.ensureBtn = ds.dtBox.querySelector('.dtpicker-buttonSet');
        //取消按钮
        ds.cancelBtn = ds.dtBox.querySelector('.dtpicker-buttonClear');

        //调节区域
        ds.components = ds.dtBox.querySelector('.dtpicker-components');

    }


    //设置实例对象的样式
    ds.setElementsStyle = function () {
        // ds.header.style.background = '#dddddd';
        //控件整体样式
        ds.content.style.border = ds.borderColor + ' ' + 'solid' + ' ' + parseInt(ds.borderWidth) + 'px';
        ds.content.style.borderRadius = parseInt(ds.borderRadius) + "px";
        //控件头部样式
        ds.header.style.background = ds.headerBgColor;
        ds.header.style.borderTopRightRadius = parseInt(ds.borderRadius) + "px";
        ds.header.style.borderTopLeftRadius = parseInt(ds.borderRadius) + "px";
        //标题显示样式
        ds.titleE.style.color = ds.titleColor;
        ds.titleE.style.fontFamily = ds.textFontFamily;
        ds.titleE.style.fontSize = parseInt(ds.titleFontsize) + 'px';

        //显示日期标签
        ds.valueLabel.style.color = ds.dateLabelColor;
        ds.valueLabel.style.fontFamily = ds.textFontFamily;
        ds.valueLabel.style.fontSize = parseInt(ds.dateLabelFontsize) + 'px';

        //确定、取消按钮样式设置
        ds.ensureBtn.style.fontFamily = ds.textFontFamily;
        ds.ensureBtn.style.color = ds.ensureBtnFontColor;
        ds.ensureBtn.style.fontSize = parseInt(ds.btnFontsize) + 'px';
        ds.ensureBtn.style.backgroundColor = ds.ensureBtnBgColor;
        //
        ds.cancelBtn.style.fontFamily = ds.textFontFamily;
        ds.cancelBtn.style.color = ds.cancelBtnFontColor;
        ds.cancelBtn.style.fontSize = parseInt(ds.btnFontsize) + 'px';
        ds.cancelBtn.style.backgroundColor = ds.cancelBtnBgColor;

        // ds.ensureBtn.style.border = ds.borderColor+' '+'solid'+' '+ parseInt(ds.borderWidth) +'px';
        // ds.cancelBtn.style.border = ds.borderColor+' '+'solid'+' '+ parseInt(ds.borderWidth) +'px';
        ds.cancelBtn.style.borderTop = ds.borderColor + ' ' + 'solid' + ' ' + parseInt(ds.borderWidth) + 'px';
        ds.cancelBtn.style.borderRight = ds.borderColor + ' ' + 'solid' + ' ' + parseInt(ds.borderWidth) + 'px';

        ds.ensureBtn.style.borderTop = ds.borderColor + ' ' + 'solid' + ' ' + parseInt(ds.borderWidth) + 'px';


        //调节区域背景颜色
        ds.components.style.background = ds.comBgColor;


    }

    ds.eventHanle = function () {
        //点击显示框
        ds.contentLabel.addEventListener('mousedown', function () {

            // ds.dtBox.classList.add('show');
            ds.dtBox.classList.add('dtpicker-mobile');
            // ds.dtBox.style.display = 'block';
        }, false);


        //点击背景
        ds.bg.addEventListener('mousedown', function () {
            ds.hiddenOverlay();
        }, false);

        ds.content.addEventListener('mousedown', function () {
            ds.contentClick(event);
        }, false);

        //关闭按钮
        ds.closeBtn.addEventListener('mousedown', function () {
            ds.closeBtnClick(event);
        }, false);

        //"确定按钮"
        ds.ensureBtn.addEventListener('mousedown', function () {
            ds.ensureBtnClick(event);
        }, false);

        //取消按钮
        ds.cancelBtn.addEventListener('mousedown', function () {
            ds.cancelBtnClick(event);
        }, false);

    }

    ds.contentClick = function (event) {
        event.preventDefault();
        event.cancelBubble = true;
    }

    //右上角关闭按钮
    ds.closeBtnClick = function (event) {
        ds.hiddenOverlay();
    }

    //确定按钮点击
    ds.ensureBtnClick = function (event) {
        //获取选中的时间
        switch (ds.type) {
            case "date":
                ds.selectDate = new Date(ds.tempDate.year.value, ds.tempDate.month.value - 1, ds.tempDate.day.value);
                break;
            case "time":
                ds.selectDate = new Date(ds.handleDateStr(ds.currentDate).getFullYear(), ds.handleDateStr(ds.currentDate).getMonth(), ds.handleDateStr(ds.currentDate).getDate(),
                    parseInt(ds.tempDate.hour.value), parseInt(ds.tempDate.minutes.value), parseInt(ds.tempDate.seconds.value));
                break;
            case "dateAndTime":
                ds.selectDate = new Date(ds.tempDate.year.value, ds.tempDate.month.value - 1, ds.tempDate.day.value,
                    parseInt(ds.tempDate.hour.value), parseInt(ds.tempDate.minutes.value));
                break;
            default:
                break;
        }

        ds.contentLabel.innerText = ds.handleDate(ds.tempDate);

        //隐藏控件
        ds.hiddenOverlay();
    }

    //取消按钮点击
    ds.cancelBtnClick = function (event) {

        ds.hiddenOverlay();
    }


    //隐藏选择器页面
    ds.hiddenOverlay = function () {
        // ds.dtBox.style.display = 'none';
        ds.dtBox.classList.remove('dtpicker-mobile');
    }

    //TODO:页面加载后需要做的处理
    ds.loaded = function () {
        //初始化数据 并创建页面
        ds.init();
        //获取标签的实例对象
        ds.getElementInstance();

        //设置实例对象的样式
        ds.setElementsStyle();
        //事件处理
        ds.eventHanle();
    }


    //创建时调用
    ds.onload = function () {
        ds.contentLabel = document.createElement('div');

        ds.contentLabel.innerText = ds.getDisplayDateStr(ds.currentDate);

        // ds.VisualElement.innerHTML = '<div id="dateSelect" style="width: 100%">'+'20180424'+'</div>';
        ds.VisualElement.appendChild(ds.contentLabel);
        ds.VisualElement.style.border = ds.borderColor + ' ' + 'solid' + ' ' + parseInt(ds.borderWidth) + 'px';
        ds.VisualElement.style.borderRadius = parseInt(ds.borderRadius) + "px";
        ds.VisualElement.style.width = '200px';

        ds.VisualElement.style.textAlign = 'center';
        ds.VisualElement.style.fontFamily = ds.textFontFamily;
        ds.VisualElement.style.fontSize = ds.titleFontsize;
        ds.VisualElement.style.color = ds.titleColor;

        ds.VisualElement.style.display = "flex";
        ds.VisualElement.style.flexDirection = "column";
        ds.VisualElement.style.justifyContent = "center";

        ds.oData = {
            sArrInputDateFormats: [],
            sArrInputTimeFormats: [],
            sArrInputDateTimeFormats: [],

        };
        ds.settings = {
            dateSeparator: "-",
            timeSeparator: ":",
            dateTimeSeparator: " ",
            isPopup: true,
            init: null
        };

        ds.loaded();

    }
    ds.onload();

    return ds;
}
DBFX.Serializer.DateTimePickerSerializer = function () {

    //反系列化
    this.DeSerialize = function (c, xe, ns) {
        DBFX.Serializer.DeSerialProperty("PickerType", c, xe);
        DBFX.Serializer.DeSerialProperty("TextFontFamily", c, xe);
        DBFX.Serializer.DeSerialProperty("TitleColor", c, xe);
        DBFX.Serializer.DeSerialProperty("TitleFontsize", c, xe);
        DBFX.Serializer.DeSerialProperty("DateLabelColor", c, xe);
        DBFX.Serializer.DeSerialProperty("DateLabelFontsize", c, xe);
        DBFX.Serializer.DeSerialProperty("BtnFontsize", c, xe);
        DBFX.Serializer.DeSerialProperty("EnsureBtnFontColor", c, xe);
        DBFX.Serializer.DeSerialProperty("CancelBtnFontColor", c, xe);
        DBFX.Serializer.DeSerialProperty("Border_Color", c, xe);
        DBFX.Serializer.DeSerialProperty("Border_Width", c, xe);
        DBFX.Serializer.DeSerialProperty("Border_Radius", c, xe);
        DBFX.Serializer.DeSerialProperty("CurrentDate", c, xe);


        DBFX.Serializer.DeSerialProperty("ComBgColor", c, xe);
        DBFX.Serializer.DeSerialProperty("HeaderBgColor", c, xe);
        DBFX.Serializer.DeSerialProperty("EnsureBtnBgColor", c, xe);
        DBFX.Serializer.DeSerialProperty("CancelBtnBgColor", c, xe);

    }

    //系列化
    this.Serialize = function (c, xe, ns) {
        DBFX.Serializer.SerialProperty("PickerType", c.PickerType, xe);
        DBFX.Serializer.SerialProperty("TextFontFamily", c.TextFontFamily, xe);
        DBFX.Serializer.SerialProperty("TitleColor", c.TitleColor, xe);
        DBFX.Serializer.SerialProperty("TitleFontsize", c.TitleFontsize, xe);
        DBFX.Serializer.SerialProperty("DateLabelColor", c.DateLabelColor, xe);
        DBFX.Serializer.SerialProperty("DateLabelFontsize", c.DateLabelFontsize, xe);
        DBFX.Serializer.SerialProperty("BtnFontsize", c.BtnFontsize, xe);
        DBFX.Serializer.SerialProperty("EnsureBtnFontColor", c.EnsureBtnFontColor, xe);
        DBFX.Serializer.SerialProperty("CancelBtnFontColor", c.CancelBtnFontColor, xe);
        DBFX.Serializer.SerialProperty("Border_Color", c.Border_Color, xe);
        DBFX.Serializer.SerialProperty("Border_Width", c.Border_Width, xe);
        DBFX.Serializer.SerialProperty("Border_Radius", c.Border_Radius, xe);
        DBFX.Serializer.SerialProperty("CurrentDate", c.CurrentDate, xe);

        DBFX.Serializer.SerialProperty("ComBgColor", c.ComBgColor, xe);
        DBFX.Serializer.SerialProperty("HeaderBgColor", c.HeaderBgColor, xe);
        DBFX.Serializer.SerialProperty("EnsureBtnBgColor", c.EnsureBtnBgColor, xe);
        DBFX.Serializer.SerialProperty("CancelBtnBgColor", c.CancelBtnBgColor, xe);


    }
}
DBFX.Design.ControlDesigners.DateTimePickerDesigner = function () {

    var obdc = new DBFX.Web.Controls.GroupPanel();
    obdc.OnCreateHandle();
    obdc.OnCreateHandle = function () {

        DBFX.Resources.LoadResource("design/DesignerTemplates/FormDesignerTemplates/DateTimePickerDesigner.scrp", function (od) {
            od.DataContext = obdc.dataContext;
        }, obdc);
    }

    obdc.HorizonScrollbar = "hidden";
    obdc.OnCreateHandle();
    obdc.Class = "VDE_Design_ObjectGeneralDesigner";
    obdc.Text = "时间选择控件";
    return obdc;
}