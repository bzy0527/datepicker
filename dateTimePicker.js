DBFX.RegisterNamespace("DBFX.Web.Controls");
DBFX.RegisterNamespace("DBFX.Design");
DBFX.RegisterNamespace("DBFX.Serializer");
DBFX.RegisterNamespace("DBFX.Design.ControlDesigners");

DBFX.Web.Controls.DateTimePicker = function (b) {

    var ds = DBFX.Web.Controls.Control("DateTimePicker");
    ds.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.InputControlDesigner");
    ds.ClassDescriptor.Designers.splice(1, 0, "DBFX.Design.ControlDesigners.DateTimePickerDesigner");
    ds.ClassDescriptor.Serializer = "DBFX.Serializer.DateTimePickerSerializer";

    //默认配置
    ds.defaults=  //Plugin Defaults
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
            minDate:  null,

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
    ds.dataObject= // Temporary Variables For Calculation Specific to DateTimePicker Instance
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
    Object.defineProperty(ds,"CurrentDate",{
        get:function () {
            return ds.currentDate;
        },
        set:function (v) {
            ds.currentDate = v;
        }
    });

    //设置选择控件的类型 date/time/dateAndTime
    ds.type = 'dateAndTime';
    Object.defineProperty(ds,"PickerType",{
        get:function () {
            return ds.type;
        },
        set:function (v) {
            ds.type = v;
            // ds.oncreate();
            var nodes = ds.VisualElement.childNodes;
            var count = nodes.length;

            //FIXME:平台判断和这里不是一样的条件 平台是大于2  这里要大于等于2
            // if(count>=2){
            //     //清除掉原来的控件
            //     ds.VisualElement.removeChild(nodes[count - 1]);
            // }

            ds.contentLabel.innerText = ds.getDisplayDateStr(ds.value);

            ds.loaded();
        }
    });

    //显示字体
    ds.textFontFamily = "PingFang SC";
    Object.defineProperty(ds,"TextFontFamily",{
        get:function () {
            return ds.textFontFamily;
        },
        set:function (v) {
            ds.textFontFamily = v;
        }
    });

    ds.textFontStyle = 400;

    //
    ds.titleColor = '#2980B9';
    Object.defineProperty(ds,"TitleColor",{
        get:function () {
            return ds.titleColor;
        },
        set:function (v) {
            ds.titleColor = v;
        }
    });

    ds.titleFontsize = 12;
    Object.defineProperty(ds,"TitleFontsize",{
        get:function () {
            return ds.titleFontsize;
        },
        set:function (v) {
            ds.titleFontsize = v;
        }
    });

    ds.dateLabelColor = '#666666';
    Object.defineProperty(ds,"DateLabelColor",{
        get:function () {
            return ds.dateLabelColor;
        },
        set:function (v) {
            ds.dateLabelColor = v;
        }
    });

    ds.dateLabelFontsize = 12;
    Object.defineProperty(ds,"DateLabelFontsize",{
        get:function () {
            return ds.dateLabelFontsize;
        },
        set:function (v) {
            ds.dateLabelFontsize = v;
        }
    });

    ds.btnFontsize = 14;
    Object.defineProperty(ds,"BtnFontsize",{
        get:function () {
            return ds.btnFontsize;
        },
        set:function (v) {
            ds.btnFontsize = v;
        }
    });

    ds.ensureBtnFontColor = '#666666';
    Object.defineProperty(ds,"EnsureBtnFontColor",{
        get:function () {
            return ds.ensureBtnFontColor;
        },
        set:function (v) {
            ds.ensureBtnFontColor = v;
        }
    });

    ds.cancelBtnFontColor = '#666666';
    Object.defineProperty(ds,"CancelBtnFontColor",{
        get:function () {
            return ds.cancelBtnFontColor;
        },
        set:function (v) {
            ds.cancelBtnFontColor = v;
        }
    });


    //调节区域背景颜色
    ds.comBgColor = '#FFFFFF';
    Object.defineProperty(ds,"ComBgColor",{
        get:function () {
            return ds.comBgColor;
        },
        set:function (v) {
            ds.comBgColor = v;
        }
    });
    //头部背景色
    ds.headerBgColor = '#CBCBCB';
    Object.defineProperty(ds,"HeaderBgColor",{
        get:function () {
            return ds.headerBgColor;
        },
        set:function (v) {
            ds.headerBgColor = v;
        }
    });
    //确认按钮背景色
    ds.ensureBtnBgColor = 'transparent';
    Object.defineProperty(ds,"EnsureBtnBgColor",{
        get:function () {
            return ds.ensureBtnBgColor;
        },
        set:function (v) {
            ds.ensureBtnBgColor = v;
        }
    });
    //取消按钮背景色
    ds.cancelBtnBgColor = 'transparent';
    Object.defineProperty(ds,"CancelBtnBgColor",{
        get:function () {
            return ds.cancelBtnBgColor;
        },
        set:function (v) {
            ds.cancelBtnBgColor = v;
        }
    });



    //边框样式
    ds.borderColor = "#cbcbcb";
    Object.defineProperty(ds,"Border_Color",{
        get:function () {
            return ds.borderColor;
        },
        set:function (v) {
            ds.borderColor = v;
        }
    });

    ds.borderWidth = 1;
    Object.defineProperty(ds,"Border_Width",{
        get:function () {
            return ds.borderWidth;
        },
        set:function (v) {
            ds.borderWidth = v;
        }
    });

    ds.borderRadius = 0;
    Object.defineProperty(ds,"Border_Radius",{
        get:function () {
            return ds.borderRadius;
        },
        set:function (v) {
            ds.borderRadius = v;
        }
    });

    ds.value = new Date();


    //保存年、月、日、时、分 显示的控件
    //{year: ,month: ,day: ,hour: ,minutes: ,seconds: }
    ds.tempDate = {};

    //选中的日期-Date对象
    ds.selectDate = ds.value;

    /*==================================平台属性配置=======================================================*/
    ds.SetHeight = function (v) {
        if(v.indexOf("%") != -1 || v.indexOf("px") != -1){
            ds.VisualElement.style.height = v;
        }else {
            ds.VisualElement.style.height = parseInt(v)+'px';
        }
        ds.VisualElement.style.lineHeight = parseInt(v)+'px';
    }

    ds.SetWidth = function (v) {
        if(v.indexOf("%") != -1 || v.indexOf("px") != -1){
            ds.VisualElement.style.width = v;
        }else {
            ds.VisualElement.style.width = parseFloat(v)+'px';
        }
    }



    //平台属性配置
    ds.VisualElement.className = "DateTimePicker";

    ds.SetFontFamily = function (v) {
        ds.textFontFamily = v;
    }

    ds.SetFontSize = function (v) {
        ds.titleFontsize = v;
    }

    ds.SetFontStyle = function (v) {
        ds.textFontStyle = v;
    }

    ds.readonly = false;
    Object.defineProperty(ds, "ReadOnly", {
        get: function () {
            return ds.readonly;
        },
        set: function (v) {

            ds.readonly = v;
            if (v != null && v != undefined && (v==true || v == "true"))
                ds.readonly = true;
            else
                ds.readonly = false;
            ds.contentLabel.readOnly = ds.readonly;
        }
    });

    //定义验证规则属性
    Object.defineProperty(ds, "CheckRule", {
        get: function () {
            return ds.checkRule;
        },
        set: function (v) {
            ds.checkRule = v;
            if (v != null && v != undefined && v!="") {
                //tbx.TextBox.style.color = "rgba(255,0,0,0.3)";
            }
        }
    });

    //TODO:验证数据是否合法
    // ds.Validate = function () {
    //
    //     var r = true;
    //     try{
    //         if (ds.checkRule != undefined) {
    //
    //             var crule = ds.checkRule.replace("Length", "ds.Value.length").replace("ICD", "ds.Value.length==18").replace("MPhoneID", "ds.Value.length==11");
    //             if (crule == "123.00") {
    //
    //                 r = (Math.abs(ds.Value * 1) >= 0);
    //
    //             }
    //             else {
    //                 crule = "r=(" + crule + ");";
    //                 r = eval(crule);
    //             }
    //
    //         }
    //     }
    //     catch (ex) {
    //         r = false;
    //     }
    //
    //     return r;
    // }

    // ds.contentLabel.innerText

    ds.ValueChanged = function () {

        if (ds.dataBindings != undefined && ds.dataContext != undefined) {
            ds.dataContext[ds.dataBindings.Path] = ds.value;
        }
        ds.RegisterFormContext();
    }

    ds.RegisterFormContext = function () {
        if (ds.FormContext != null && ds.dataProperty != "" && ds.dataProperty != undefined) {
            if (ds.dataDomain != undefined && ds.dataDomain != "") {

                var ddv = ds.FormContext[ds.dataDomain];
                if (ddv == undefined)
                    ds.FormContext[ds.dataDomain] = new DBFX.DataDomain();
                ds.FormContext[ds.dataDomain][ds.dataProperty] = ds.value;
            }
            else {
                ds.FormContext[ds.dataProperty] = ds.value;
            }
        }
    }


    ds.GetValue=function() {
        return ds.value;
    }

    ds.SetValue = function (v) {

        try{
            if (typeof v == "string")
                v = new Date(v);

            if (isNaN(v))
                v = new Date();

            if (v == undefined || v == "" || isNaN(new Date(v)))
                v = new Date();

            ds.value = v;
            ds.SetDateValue(v);

        }
        catch(ex)
        {
            //alert(ex.toString());
        }
    }

    ds.SetDateValue = function (v) {

        var dstr="";

        // switch (ds.type){
        //     case 'date':
        //         dstr=(v.getMonth()+1)+"-"+v.getDate()+"-"+v.getFullYear();
        //         ds.value = new Date(dstr);
        //         ds.contentLabel.innerText = ds.value.toLocaleDateString();
        //         break;
        //     case 'time':
        //         ds.value = v;
        //         ds.contentLabel.innerText = v.toLocaleTimeString();
        //         break;
        //     case 'dateAndTime':
        //         ds.value = v;
        //         ds.contentLabel.innerText = ds.value.toLocaleDateString() + " " + v.toLocaleTimeString();
        //         break;
        //     default:
        //         break;
        // }

        ds.contentLabel.innerText = ds.getDisplayDateStr(v);

        ds.ValueChanged();

    }

    //可用设置
    ds.SetEnabled = function (v) {
        if(v==true){
            ds.VisualElement.addEventListener('mousedown',ds.popUpPicker,false);
            ds.VisualElement.addEventListener('touchstart',ds.popUpPicker,false);
            ds.VisualElement.style.background = "";
            ds.contentLabel.style.color = '';
        }else {
            ds.VisualElement.removeEventListener('mousedown',ds.popUpPicker,false);
            ds.VisualElement.removeEventListener('touchstart',ds.popUpPicker,false);
            ds.VisualElement.style.background = "#eeeeee";
            ds.contentLabel.style.color = '#bbb';
        }
    }

    //可见性设置
    ds.SetVisibled = function (v) {

        console.log(v);
        console.log(ds.display);

        if(v==true){
            ds.VisualElement.style.display = ds.display;
        }else {
            ds.VisualElement.style.display = 'none';
        }
    }


    /*============================================================================================*/
    ds.init = function () {
        var oDTP = ds;

        if(oDTP.settings.isPopup)
        {
            oDTP.createPicker();
            // $(oDTP.element).addClass("dtpicker-mobile");

            switch (ds.type){
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

        if(oDTP.settings.init)
            oDTP.settings.init.call(oDTP);
        //
        // oDTP._addEventHandlersForInput();
    }

    //创建控件的整体
    ds.createPicker = function () {
        //标签显示的时间
        var title;
        var timeLabel;


        switch (ds.type){
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

        timeLabel = ds.getDisplayDateStr(ds.value);


        var sTempStr = "";
        // sTempStr += "<div  id='dtBox' class='dtpicker-overlay dtpicker-mobile'>";
        // sTempStr += "<div  id='dtBox' class='dtpicker-overlay'>";
        sTempStr += "<div class='dtpicker-bg'>";
        sTempStr += "<div class='dtpicker-cont'>";
        sTempStr += "<div class='dtpicker-content'>";
        sTempStr += "<div class='dtpicker-subcontent'>";

        //控件头 标题 显示选中的时间
        sTempStr += "<div class='dtpicker-header'>";
        sTempStr += "<div class='dtpicker-title'>"+title+"</div>";
        sTempStr += "<a class='dtpicker-close'>×</a>";
        sTempStr += "<div class='dtpicker-value'>"+timeLabel+"</div>";
        sTempStr += "</div>";

        //控件主题选择器
        sTempStr += "<div class='dtpicker-components'>";
        sTempStr += "</div>";

        //按钮布局
        sTempStr += "<div class='dtpicker-buttonCont dtpicker-twoButtons'>";
        sTempStr += "<a class='dtpicker-button dtpicker-buttonSet'>"+"确定"+"</a>";
        sTempStr += "<a class='dtpicker-button dtpicker-buttonClear'>"+"取消"+"</a>";
        sTempStr += "</div>";


        sTempStr += "</div>";
        sTempStr += "</div>";
        sTempStr += "</div>";
        sTempStr += "</div>";
        // sTempStr += "</div>";

        ds.dtBox = document.createElement('div');
        ds.dtBox.setAttribute('id','dtBox');
        ds.dtBox.classList.add('dtpicker-overlay');
        ds.dtBox.classList.add('dtpicker-mobile');
        ds.dtBox.innerHTML = sTempStr;
        // ds.VisualElement.innerHTML = sTempStr;
        // ds.VisualElement.appendChild(div);

    }

    //创建日期选择控件Date
    ds.createDateComponent = function () {

        //年
        var yearCom = ds.createComponent();
        yearCom.classList.add('dtpicker-comp3');
        yearCom.querySelector('.dtpicker-comp').classList.add('year');
        // yearCom.querySelector('.dtpicker-compValue').value= ds.handleDateStr(ds.currentDate).getFullYear();
        yearCom.querySelector('.dtpicker-compValue').value= ds.value.getFullYear();
        ds.tempDate.year = yearCom.querySelector('.dtpicker-compValue');
        //月
        var monthCom = ds.createComponent();
        monthCom.classList.add('dtpicker-comp3');
        monthCom.querySelector('.dtpicker-comp').classList.add('month');
        // monthCom.querySelector('.dtpicker-compValue').value= ds.handleDateStr(ds.currentDate).getMonth();
        monthCom.querySelector('.dtpicker-compValue').value= ds.value.getMonth()+1;
        ds.tempDate.month = monthCom.querySelector('.dtpicker-compValue');
        //日
        var dayCom = ds.createComponent();
        dayCom.classList.add('dtpicker-comp3');
        dayCom.querySelector('.dtpicker-comp').classList.add('day');
        // dayCom.querySelector('.dtpicker-compValue').value= ds.handleDateStr(ds.currentDate).getDate();
        dayCom.querySelector('.dtpicker-compValue').value= ds.value.getDate();
        ds.tempDate.day = dayCom.querySelector('.dtpicker-compValue');


        // ds.VisualElement.querySelector('.dtpicker-components').appendChild(yearCom);
        // ds.VisualElement.querySelector('.dtpicker-components').appendChild(monthCom);
        // ds.VisualElement.querySelector('.dtpicker-components').appendChild(dayCom);


        ds.dtBox.querySelector('.dtpicker-components').appendChild(yearCom);
        ds.dtBox.querySelector('.dtpicker-components').appendChild(monthCom);
        ds.dtBox.querySelector('.dtpicker-components').appendChild(dayCom);

        // console.log(yearCom);
    }

    //创建时间选择控件Time
    ds.createTimeComponent = function () {
        //时
        var hourCom = ds.createComponent();
        hourCom.classList.add('dtpicker-comp3');
        hourCom.querySelector('.dtpicker-comp').classList.add('hour');
        // hourCom.querySelector('.dtpicker-compValue').value= ds.handleDateStr(ds.currentDate).getHours()+"时";

        hourCom.querySelector('.dtpicker-compValue').value= ds.value.getHours()+"时";
        ds.tempDate.hour = hourCom.querySelector('.dtpicker-compValue');
        //分
        var minutesCom = ds.createComponent();
        minutesCom.classList.add('dtpicker-comp3');
        minutesCom.querySelector('.dtpicker-comp').classList.add('minutes');
        // minutesCom.querySelector('.dtpicker-compValue').value= ds.handleDateStr(ds.currentDate).getMinutes()+"分";

        minutesCom.querySelector('.dtpicker-compValue').value= ds.value.getMinutes()+"分";

        ds.tempDate.minutes = minutesCom.querySelector('.dtpicker-compValue');
        //秒
        var secondsCom = ds.createComponent();
        secondsCom.classList.add('dtpicker-comp3');
        secondsCom.querySelector('.dtpicker-comp').classList.add('seconds');
        // secondsCom.querySelector('.dtpicker-compValue').value= ds.handleDateStr(ds.currentDate).getSeconds()+"秒";

        secondsCom.querySelector('.dtpicker-compValue').value= ds.value.getSeconds()+"秒";
        ds.tempDate.seconds = secondsCom.querySelector('.dtpicker-compValue');

        // ds.VisualElement.querySelector('.dtpicker-components').appendChild(hourCom);
        // ds.VisualElement.querySelector('.dtpicker-components').appendChild(minutesCom);
        // ds.VisualElement.querySelector('.dtpicker-components').appendChild(secondsCom);

        ds.dtBox.querySelector('.dtpicker-components').appendChild(hourCom);
        ds.dtBox.querySelector('.dtpicker-components').appendChild(minutesCom);
        ds.dtBox.querySelector('.dtpicker-components').appendChild(secondsCom);



    }


    //创建日期&时间选择控件dateAndTime
    ds.createDateTimeComponent = function () {
        //年
        var yearCom = ds.createComponent();
        yearCom.classList.add('dtpicker-comp5');
        yearCom.querySelector('.dtpicker-comp').classList.add('year');
        // yearCom.querySelector('.dtpicker-compValue').value= ds.handleDateStr(ds.currentDate).getFullYear();
        yearCom.querySelector('.dtpicker-compValue').value= ds.value.getFullYear();


        ds.tempDate.year = yearCom.querySelector('.dtpicker-compValue');
        //月
        var monthCom = ds.createComponent();
        monthCom.classList.add('dtpicker-comp5');
        monthCom.querySelector('.dtpicker-comp').classList.add('month');
        // monthCom.querySelector('.dtpicker-compValue').value= ds.handleDateStr(ds.currentDate).getMonth();
        monthCom.querySelector('.dtpicker-compValue').value= ds.value.getMonth()+1;

        ds.tempDate.month = monthCom.querySelector('.dtpicker-compValue');
        //日
        var dayCom = ds.createComponent();
        dayCom.classList.add('dtpicker-comp5');
        dayCom.querySelector('.dtpicker-comp').classList.add('day');
        // dayCom.querySelector('.dtpicker-compValue').value= ds.handleDateStr(ds.currentDate).getDate();
        dayCom.querySelector('.dtpicker-compValue').value= ds.value.getDate();

        ds.tempDate.day = dayCom.querySelector('.dtpicker-compValue');
        //时
        var hourCom = ds.createComponent();
        hourCom.classList.add('dtpicker-comp5');
        hourCom.querySelector('.dtpicker-comp').classList.add('hour');
        // hourCom.querySelector('.dtpicker-compValue').value= ds.handleDateStr(ds.currentDate).getHours()+"时";
        hourCom.querySelector('.dtpicker-compValue').value= ds.value.getHours()+"时";

        ds.tempDate.hour = hourCom.querySelector('.dtpicker-compValue');
        //分
        var minutesCom = ds.createComponent();
        minutesCom.classList.add('dtpicker-comp5');
        minutesCom.querySelector('.dtpicker-comp').classList.add('minutes');
        // minutesCom.querySelector('.dtpicker-compValue').value= ds.handleDateStr(ds.currentDate).getMinutes()+"分";
        minutesCom.querySelector('.dtpicker-compValue').value= ds.value.getMinutes()+"分";

        ds.tempDate.minutes = minutesCom.querySelector('.dtpicker-compValue');


        // ds.VisualElement.querySelector('.dtpicker-components').appendChild(yearCom);
        // ds.VisualElement.querySelector('.dtpicker-components').appendChild(monthCom);
        // ds.VisualElement.querySelector('.dtpicker-components').appendChild(dayCom);
        // ds.VisualElement.querySelector('.dtpicker-components').appendChild(hourCom);
        // ds.VisualElement.querySelector('.dtpicker-components').appendChild(minutesCom);

        ds.dtBox.querySelector('.dtpicker-components').appendChild(yearCom);
        ds.dtBox.querySelector('.dtpicker-components').appendChild(monthCom);
        ds.dtBox.querySelector('.dtpicker-components').appendChild(dayCom);
        ds.dtBox.querySelector('.dtpicker-components').appendChild(hourCom);
        ds.dtBox.querySelector('.dtpicker-components').appendChild(minutesCom);

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

        var incrementE = component.querySelector('.increment');
        var decrementE = component.querySelector(".decrement");


        //pc鼠标点击"+"号按钮
        component.querySelector(".increment").addEventListener('mousedown',function () {
            // console.log(this.parentNode);
            ds.handleIncrementBtnClick(event,this);
        },false);
        //APP手指触摸
        component.querySelector(".increment").addEventListener('touchstart',function () {
            // console.log(this.parentNode);
            ds.handleIncrementBtnClick(event,this);
        },false);
        //PC鼠标抬起
        component.querySelector(".increment").addEventListener('mouseup',function () {
            // console.log(this.parentNode);
            ds.handleIncrementBtnUp();
        },false);
        //APP手指触摸结束和取消
        component.querySelector(".increment").addEventListener('touchend',function () {
            // console.log(this.parentNode);
            ds.handleIncrementBtnUp();
        },false);

        component.querySelector(".increment").addEventListener('touchcancel',function () {
            // console.log(this.parentNode);
            ds.handleIncrementBtnUp();
        },false);



        //"-"号事件处理添加
        component.querySelector(".decrement").addEventListener('mousedown',function () {
            // console.log(this.parentNode);
            ds.handleDecrementBtnClick(event,this);
        },false);
        component.querySelector(".decrement").addEventListener('touchstart',function () {
            // console.log(this.parentNode);
            ds.handleDecrementBtnClick(event,this);
        },false);


        component.querySelector(".decrement").addEventListener('mouseup',function () {
            // console.log(this.parentNode);
            ds.handleDecrementBtnUp();
        },false);
        component.querySelector(".decrement").addEventListener('touchend',function () {
            // console.log(this.parentNode);
            ds.handleDecrementBtnUp();
        },false);
        component.querySelector(".decrement").addEventListener('touchcancel',function () {
            // console.log(this.parentNode);
            ds.handleDecrementBtnUp();
        },false);


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
        var y,m,d,h,mi,sec;
        y = dates[0];
        m = dates[1];
        d = dates[2];
        h = times[0];
        mi = times[1];
        sec = times[2];
        return new Date(y,m,d,h,mi,sec);
    }

    ds.handleDate = function (dateObj) {
        //创建变动的日期
        var tempD;
        switch (ds.type){
            case "date":
                tempD = new Date(dateObj.year.value,dateObj.month.value-1,dateObj.day.value);
                break;
            case "time":

                tempD = new Date(ds.value.getFullYear(),ds.value.getMonth()+1,ds.value.getDate(),
                    parseInt(dateObj.hour.value),parseInt(dateObj.minutes.value),parseInt(dateObj.seconds.value));
                break;
            case "dateAndTime":
                tempD = new Date(dateObj.year.value,dateObj.month.value-1,dateObj.day.value,
                    parseInt(dateObj.hour.value),parseInt(dateObj.minutes.value));
                break;
            default:
                break;
        }

        // console.log(tempD);
        var y = tempD.getFullYear(),
            m = tempD.getMonth()+1,
            d = tempD.getDate(),
            h = tempD.getHours(),
            mi = tempD.getMinutes(),
            sec = tempD.getSeconds(),
            week = tempD.getDay();

        // console.log(ds.defaults.shortDayNames[week]);

        var showText;
        switch (ds.type){
            case "date":
                dateObj.year.value = y;
                dateObj.month.value = m;
                dateObj.day.value = d;
                showText = y+ds.defaults.dateSeparator+m+ds.defaults.dateSeparator+d;//+ds.defaults.dateSeparator+ds.defaults.shortDayNames[week];
                break;
            case "time":
                var minutes = ''+mi,
                    seconds = ''+sec;

                mi = minutes.length == 2 ? mi : '0'+mi;
                sec = seconds.length == 2 ? sec : '0'+sec;

                dateObj.hour.value = h+"时";
                dateObj.minutes.value = mi+"分";
                dateObj.seconds.value = sec+"秒";
                showText = h+ds.defaults.timeSeparator+mi+ds.defaults.timeSeparator+sec;

                break;
            case "dateAndTime":
                dateObj.year.value = y;
                dateObj.month.value = m;
                dateObj.day.value = d;

                var minutes = ''+mi,
                    seconds = ''+sec;

                mi = minutes.length == 2 ? mi : '0'+mi;
                sec = seconds.length == 2 ? sec : '0'+sec;

                dateObj.hour.value = h+"时";
                dateObj.minutes.value = mi+"分";

                //显示周：ds.defaults.dateSeparator+ds.defaults.shortDayNames[week]
                showText = y+ds.defaults.dateSeparator+m+ds.defaults.dateSeparator+d+" "
                    +h+ds.defaults.timeSeparator+mi;

                break;
            default:
                break;
        }

        return showText;
    }

    //获取时间显示字符串
    ds.getDisplayDateStr = function (date) {

        var y,m,d,h,mi,sec,week;
        if(date instanceof Date){

            y = date.getFullYear();
            m = date.getMonth()+1;
            d = date.getDate();
            h = date.getHours();
            mi = date.getMinutes();
            sec = date.getSeconds();
            week = date.getDay();

        }else {//xxxx-xx-xx xx:xx:xx
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
        switch (ds.type){
            case "date":
                showText = y+ds.defaults.dateSeparator+m+ds.defaults.dateSeparator+d;//+ds.defaults.dateSeparator+ds.defaults.shortDayNames[week];
                break;
            case "time":
                var minutes = ''+mi,
                    seconds = ''+sec;

                mi = minutes.length == 2 ? mi : '0'+mi;
                sec = seconds.length == 2 ? sec : '0'+sec;
                showText = h+ds.defaults.timeSeparator+mi+ds.defaults.timeSeparator+sec;
                break;
            case "dateAndTime":

                var minutes = ''+mi,
                    seconds = ''+sec;

                mi = minutes.length == 2 ? mi : '0'+mi;
                sec = seconds.length == 2 ? sec : '0'+sec;

                //显示周：ds.defaults.dateSeparator+ds.defaults.shortDayNames[week]
                showText = y+ds.defaults.dateSeparator+m+ds.defaults.dateSeparator+d+" "
                    +h+ds.defaults.timeSeparator+mi;
                break;
            default:
                break;
        }

        return showText;
    }

    //处理'+'点击事件
    ds.handleIncrementBtnClick = function (event,element) {
        var ev = event || window.event;
        function update() {
            var parentN = element.parentNode;
            // console.log(parentN.classList.contains('day'));

            var label = parentN.querySelector('.dtpicker-compValue');
            label.value = parseInt(label.value)+1;
            //更新显示的数值
            ds.updateValues();
        }

        switch (event.type){
            case "touchstart":
                event.preventDefault();
                update();
                ds.incrementBtnClickOut = setInterval(function () {
                    update();
                },150);
                break;
            case "mousedown":
                update();
                ds.incrementBtnClickOut = setInterval(function () {
                    update();
                },150);
                break;
        }

    }

    ds.handleIncrementBtnUp = function () {
        clearInterval(ds.incrementBtnClickOut);
    }

    //处理'-'点击事件
    ds.handleDecrementBtnClick = function (event,element) {
        var ev = event || window.event;
        function update() {
            var parentN = element.parentNode;
            var label = parentN.querySelector('.dtpicker-compValue');
            label.value = parseInt(label.value)-1;
            //更新显示的数值
            ds.updateValues();
        }
        switch (event.type){
            case "touchstart":
                event.preventDefault();
                update();
                ds.decrementBtnClickOut = setInterval(function () {
                    update();
                },150);
                break;
            case "mousedown":
                update();
                ds.decrementBtnClickOut = setInterval(function () {
                    update();
                },150);
                break;
        }

    }


    ds.handleDecrementBtnUp = function () {
        clearInterval(ds.decrementBtnClickOut);
    }





    //获取元素的实例对象
    ds.getElementInstance = function () {
        //控件页面整体
        // ds.dtBox = document.getElementById('dtBox');
        // ds.dtBox = ds.VisualElement.querySelector('.dtpicker-overlay');


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
        ds.VisualElement.style.border = ds.borderColor+' '+'solid'+' '+ parseInt(ds.borderWidth) +'px';
        ds.VisualElement.style.borderRadius = parseInt(ds.borderRadius)+"px";
        ds.VisualElement.style.fontFamily = ds.textFontFamily;

        ds.contentLabel.style.fontSize = parseInt(ds.dateLabelFontsize)+'px';
        ds.VisualElement.style.fontStyle = ds.textFontStyle;
        ds.VisualElement.style.color = ds.titleColor;

        //控件整体样式
        ds.content.style.border = ds.borderColor+' '+'solid'+' '+ parseInt(ds.borderWidth) +'px';
        ds.content.style.borderRadius = parseInt(ds.borderRadius)+"px";
        //控件头部样式
        ds.header.style.background = ds.headerBgColor;
        ds.header.style.borderTopRightRadius = parseInt(ds.borderRadius)+"px";
        ds.header.style.borderTopLeftRadius = parseInt(ds.borderRadius)+"px";
        //标题显示样式
        ds.titleE.style.color = ds.titleColor;
        ds.titleE.style.fontFamily = ds.textFontFamily;
        ds.titleE.style.fontSize = parseInt(ds.titleFontsize)+'px';

        //显示日期标签
        ds.valueLabel.style.color = ds.dateLabelColor;
        ds.valueLabel.style.fontFamily = ds.textFontFamily;
        ds.valueLabel.style.fontSize = parseInt(ds.dateLabelFontsize)+'px';

        //确定、取消按钮样式设置
        ds.ensureBtn.style.fontFamily = ds.textFontFamily;
        ds.ensureBtn.style.color = ds.ensureBtnFontColor;
        ds.ensureBtn.style.fontSize = parseInt(ds.btnFontsize)+'px';
        ds.ensureBtn.style.backgroundColor = ds.ensureBtnBgColor;
        //
        ds.cancelBtn.style.fontFamily = ds.textFontFamily;
        ds.cancelBtn.style.color = ds.cancelBtnFontColor;
        ds.cancelBtn.style.fontSize = parseInt(ds.btnFontsize)+'px';
        ds.cancelBtn.style.backgroundColor = ds.cancelBtnBgColor;

        // ds.ensureBtn.style.border = ds.borderColor+' '+'solid'+' '+ parseInt(ds.borderWidth) +'px';
        // ds.cancelBtn.style.border = ds.borderColor+' '+'solid'+' '+ parseInt(ds.borderWidth) +'px';
        ds.cancelBtn.style.borderTop = ds.borderColor+' '+'solid'+' '+ parseInt(ds.borderWidth) +'px';
        ds.cancelBtn.style.borderRight = ds.borderColor+' '+'solid'+' '+ parseInt(ds.borderWidth) +'px';
        ds.ensureBtn.style.borderTop = ds.borderColor+' '+'solid'+' '+ parseInt(ds.borderWidth) +'px';


        //调节区域背景颜色
        ds.components.style.background = ds.comBgColor;


    }

    ds.eventHanle = function () {
        //点击显示框
        ds.VisualElement.addEventListener('mousedown',ds.popUpPicker,false);
        ds.VisualElement.addEventListener('touchstart',ds.popUpPicker,false);

        //点击背景
        ds.bg.addEventListener('mousedown',function () {
            ds.hiddenOverlay();
        },false);

        ds.content.addEventListener('mousedown',function () {
            ds.contentClick(event);
        },false);

        //关闭按钮
        ds.closeBtn.addEventListener('mousedown',function () {
            ds.closeBtnClick(event);
        },false);

        //"确定按钮"
        ds.ensureBtn.addEventListener('mousedown',function () {
            ds.ensureBtnClick(event);
        },false);

        //取消按钮
        ds.cancelBtn.addEventListener('mousedown',function () {
            ds.cancelBtnClick(event);
        },false);

    }

    ds.popUpPicker = function () {
        switch (event.type){
            case "touchstart":
                event.preventDefault();
                document.body.appendChild(ds.dtBox);
                break;
            case "mousedown":
                document.body.appendChild(ds.dtBox);
                break;
            default:
                break;
        }
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
        switch (ds.type){
            case "date":
                ds.value = new Date(ds.tempDate.year.value,ds.tempDate.month.value-1,ds.tempDate.day.value);
                ds.selectDate = new Date(ds.tempDate.year.value,ds.tempDate.month.value-1,ds.tempDate.day.value);
                break;
            case "time":
                ds.value = new Date(ds.value.getFullYear(),ds.value.getMonth()+1,ds.value.getDate(),
                    parseInt(ds.tempDate.hour.value),parseInt(ds.tempDate.minutes.value),parseInt(ds.tempDate.seconds.value));
                ds.selectDate = new Date(ds.value.getFullYear(),ds.value.getMonth()+1,ds.value.getDate(),
                    parseInt(ds.tempDate.hour.value),parseInt(ds.tempDate.minutes.value),parseInt(ds.tempDate.seconds.value));
                break;
            case "dateAndTime":
                ds.value = new Date(ds.tempDate.year.value,ds.tempDate.month.value-1,ds.tempDate.day.value,
                    parseInt(ds.tempDate.hour.value),parseInt(ds.tempDate.minutes.value));
                ds.selectDate = new Date(ds.tempDate.year.value,ds.tempDate.month.value-1,ds.tempDate.day.value,
                    parseInt(ds.tempDate.hour.value),parseInt(ds.tempDate.minutes.value));
                break;
            default:
                break;
        }


        ds.contentLabel.innerText = ds.handleDate(ds.tempDate);
        ds.ValueChanged();

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
        // ds.dtBox.classList.remove('dtpicker-mobile');
        document.body.removeChild(ds.dtBox);
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

        ds.display = ds.VisualElement.style.display;

    }


    //创建时调用
    ds.onload = function () {
        ds.contentLabel = document.createElement('div');

        ds.contentLabel.innerText = ds.getDisplayDateStr(ds.value);
        ds.contentLabel.style.display = 'inline-block';

        // ds.VisualElement.innerHTML = '<div id="dateSelect" style="width: 100%">'+'20180424'+'</div>';
        ds.VisualElement.appendChild(ds.contentLabel);
        ds.VisualElement.style.width = '100px';
        ds.VisualElement.style.height = '50px';
        ds.VisualElement.style.textAlign = 'center';

        ds.VisualElement.style.display = 'block';
        ds.VisualElement.style.lineHeight = '50px';


        // ds.VisualElement.style.display = "flex";
        // ds.VisualElement.style.flexDirection = "column";
        // ds.VisualElement.style.justifyContent = "center";


        if(b!=undefined){
            ds.DataBindings = b;
        }

        ds.oData = {
            sArrInputDateFormats: [],
            sArrInputTimeFormats:[],
            sArrInputDateTimeFormats:[],

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
        // DBFX.Serializer.DeSerialProperty("CurrentDate", c, xe);


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
        // DBFX.Serializer.SerialProperty("CurrentDate", c.CurrentDate, xe);

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