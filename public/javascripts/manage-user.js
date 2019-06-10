var $table = $('#table');
var categories;
var validator;
const formValidateOption = {
    rules: {
        roleID: 'required',
        name: 'required',
        email: {
            required: true,
            email: true,
            remote: {
                url: '/check-email-available',
                type: 'post',
                data: {
                    email: function () {
                        return $('#email').val();
                    }
                }
            }
        },
        dayOfBirth: {
            required: true
        }
    },
    messages: {
        roleID: 'Chưa chọn chức vụ',
        name: 'Hãy nhập đầy đủ họ và tên',
        email: {
            required: 'Hãy nhập địa chỉ email',
            email: 'Email không hợp lệ',
            remote: 'Email đã được sử dụng'
        },
        dayOfBirth: {
            required: 'Hãy nhập ngày sinh'
        }
    },
    errorElement: 'em',

    errorPlacement: function (error, element) {
        // Add the `invalid-feedback` class to the error element
        error.addClass('invalid-feedback');
        if (element.prop('type') === 'checkbox') {
            error.insertAfter(element.next('label'));
        } else {
            error.insertAfter(element);
        }
    },
    highlight: function (element, errorClass, validClass) {
        $(element).addClass('is-invalid').removeClass('is-valid');
    },
    unhighlight: function (element, errorClass, validClass) {
        $(element).addClass('is-valid').removeClass('is-invalid');
    },

    submitHandler: (form) => {
        addUserFormHandler(form);
    },
};

const datePickerOption = {
    todayBtn: 'linked',
    clearBtn: true,
    language: 'vi',
    autoclose: true,
    orientation: 'bottom auto',
    todayHighlight: true
};

$(function () {

    // side bar
    $('.sidenav-badge').hide();

    // ajax load category, then call initTable() when done
    loadAllCategory();

    // datepicker
    $('#dayOfBirth').datepicker(datePickerOption);

    // form validate
    validator = $('#addUserForm').validate(formValidateOption);

});

function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
        return row.id;
    });
}

function categoryFormatter(value, row, index, field) {
    if (row.role.toUpperCase() === 'biên tập viên'.toUpperCase()) {
        var html = [`
            <select class='form-control category-dropdown-menu' style='text-align: center; text-align-last: center;' >
        `];
        var isCategoryHasAssigned = false;
        for (var i = 0; i < categories.length; i++) {

            if (value !== null && value.toUpperCase() === categories[i].name.toUpperCase()) {
                html += `<option class="text-capitalize" value="${categories[i].id}" selected>${categories[i].name}</option>`;
                isCategoryHasAssigned = true;
            } else {
                html += `<option class="text-capitalize" value="${categories[i].id}">${categories[i].name}</option>`;
            }
        }
        if (!isCategoryHasAssigned) {
            html += '<option selected>N/A</option>';
        }
        html += '</select>';
        return html;
    }
}

$('.category-dropdown-menu').on('click', function () {
    console.log('test');
});

function initTable() {
    $table.bootstrapTable('destroy').bootstrapTable({
        height: 800,
        locale: 'vi-VN',
        toolbar: '#toolbar',
        pagination: true,
        search: true,
        showPaginationSwitch: true,
        showRefresh: true,
        showToggle: true,
        showColumns: true,
        showFullscreen: true,
        smartDisplay: true,
        clickToSelect: true,
        undefinedText: 'N/A',
        // extension
        stickyHeader: true,
        stickyHeaderOffsetY: 56,
        showJumpto: true,
        searchAccentNeutralise: true,
        //filter
        filterControl: true,
        filterShowClear: true,

        columns: [{ field: 'state', checkbox: true, align: 'center', valign: 'middle', width: '5%', },
        { field: 'id', title: 'ID', align: 'center', valign: 'middle', sortable: true, width: '5%' },
        { field: 'name', title: 'Tên', align: 'center', valign: 'middle', sortable: true, width: '40%', },
        //{ field: 'date', title: 'Ngày tạo', align: 'center', valign: 'middle', sortable: true, width: '20%', }, 
        { field: 'role', title: 'Vai trò', align: 'center', valign: 'center', sortable: true, width: '15%', filterControl: 'select' },
        { field: 'categoryManaged', title: 'Chuyên mục', align: 'center', valign: 'center', width: '15%', formatter: categoryFormatter }],
        //data: tableData,
        pageSize: 5,
        sidePagination: 'server',
        url: '/admin/users/load',
    });
}

$table.on('check.bs.table uncheck.bs.table ' +
    'check-all.bs.table uncheck-all.bs.table',
    function () {
        $('#remove').prop('disabled', !$table.bootstrapTable('getSelections').length);
        $('#edit').prop('disabled', $table.bootstrapTable('getSelections').length > 1);

        // save your data, here just save the current page
        var selections = getIdSelections();
        // push or splice the selections if you want to save all data selections
    });

$table.on('all.bs.table', function (e, name, args) {
});

$('#remove').click(function () {
    var ids = getIdSelections();
    ajaxDeleteUser(ids);
});

$('#add').click(function () {
    //get the form html DOM element, then clear entry form content
    $('#addUserForm')[0].reset();

    // remove green high light and red high light
    $('input').removeClass('is-valid').removeClass('is-invalid');

    // reset form validator
    validator.resetForm();

    $('#addUserModal').modal('show');
});

function mounted() {
    initTable();
}

$('#table').on('post-body.bs.table', function (e, data) {
    // init context menu when the table body is rendered
    initContextMenu();
});

function initContextMenu() {
    $('tbody').addClass('context-menu-one');

    $('.context-menu-one').contextMenu({
        selector: 'tr',
        callback: function (key, options) {
            let dataIndex = parseInt($(this).attr('data-index'), 10);
            let row = $table.bootstrapTable('getData', true)[dataIndex];
            let ids;

            ids = getIdSelections();
            if (ids.length === 0) {
                ids = [row.id,];
            }

<<<<<<< HEAD
    // item click handler
    // remove event handler
    $('#removeItem').click(function (e) {
        console.log('remove clicked');
        
        // $table.bootstrapTable('remove', {
        //     field: 'id',
        //     values: ids
        // });
=======
            switch (key) {
                case 'edit':
                    break;

                case 'delete':
                    ajaxDeleteUser(ids);
                    break;

                case 'assign':
                    break;

                case 'renew':
                    break;

                default:
                    break;
            }
        },
        items: {
            'edit': { name: 'Chỉnh sửa', icon: 'edit' },
            'delete': { name: 'Xóa', icon: 'delete' },
            'assign': {
                name: 'Phân công',
                icon: 'fas fa-marker',
                disabled: function (key, opt) {
                    let dataIndex = parseInt(opt.$trigger.attr('data-index'), 10);
                    let row = $table.bootstrapTable('getData', true)[dataIndex];
                    return row.role.toUpperCase() !== 'BIÊN TẬP VIÊN';
                },
            },
            'renew': {
                name: 'Gia hạn',
                icon: 'fas fa-hourglass-start',
                disabled: function (key, opt) {
                    let dataIndex = parseInt(opt.$trigger.attr('data-index'), 10);
                    let row = $table.bootstrapTable('getData', true)[dataIndex];
                    return row.role.toUpperCase() !== 'ĐỘC GIẢ';
                },
            }
        }
>>>>>>> cf5b75f15e0a314daab5cf1542bfbdbb071c7f4d
    });
}

$(document).click(function () {
    $('#context-menu').hide();
});

$('#context-menu').click(function () {
    $('#context-menu').hide();
});

/* Sidebar */
$('#mySidenav a').mouseenter(function () {
    $(this).find('.sidenav-after-icon').hide();
    $(this).find('.sidenav-badge').show();
});

$('#mySidenav a').mouseleave(function () {
    $(this).find('.sidenav-after-icon').show();
    $(this).find('.sidenav-badge').hide();
});

function addUserFormHandler(form) {

    $('#addUserModal').modal('hide');
    //get the action-url of the form
    var actionURL = '/admin/users/add';

    //do your own request an handle the results
    $.ajax({
        url: actionURL,
        type: 'post',
        data: $(form).serialize(),
    })
        .done(htmlString => {
            $('#alert-container').append(htmlString);

            // refresh table
            $table.bootstrapTable('refresh');
        });
}

function loadAllCategory() {
    $.ajax({
        type: 'get',
        url: '/admin/categories/load?load=parent',
    })
        .done(data => {
            categories = data;
            initTable();
        });
}

function ajaxDeleteUser(ids) {
    $.ajax({
        type: 'delete',
        url: '/admin/users/delete',
        data: { ids: JSON.stringify(ids) },
    }).done(htmlString => {
        $('#alert-container').append(htmlString);
        $('#remove').prop('disabled', true);
        $table.bootstrapTable('refresh');
    });
}