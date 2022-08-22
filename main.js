$('#calendar_input .form-control-date.floating-control').datepicker({
    format: 'dd.mm.yyyy',
    language: 'ru',
    // autoclose: true,
    // todayHighlight: true
});

$('#date_edit_booking .date_edit_booking.floating-control').datepicker({
    format: 'dd.mm.yyyy',
    language: 'ru',
});

$('#single-input').clockpicker({
    placement: 'bottom',
    align: 'right',
    autoclose: true,
    // donetext: 'OK'/*кнопка подтверждения выбора времени-убрать autoclose*/
    // 'default': '20:48'
});

