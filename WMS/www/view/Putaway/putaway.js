appControllers.controller( 'PutawayListCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    '$timeout',
    '$ionicPopup',
    '$ionicLoading',
    '$cordovaBarcodeScanner',
    'ApiService',
    'PopupService',
    function (
        $scope,
        $stateParams,
        $state,
        $timeout,
        $ionicPopup,
        $ionicLoading,
        $cordovaBarcodeScanner,
        ApiService,
        PopupService ) {
        var popup = null;
        var popupTitle = '';
        $scope.Rcbp1 = {};
        $scope.GrnNo = {};
        $scope.Imgr1s = {};
        $scope.Imgr2s = {};
        var confirm = function () {
            $ionicLoading.show();
            for ( var i = 0; i < $scope.Imgr2s.length; i++ ) {
                var imgr2 = $scope.Imgr2s[ i ];
                var objUri = ApiService.Uri( true, '/api/wms/imgr2/putaway/update' );
                objUri.addSearch( 'StoreNo', imgr2.StoreNo );
                objUri.addSearch( 'TrxNo', imgr2.TrxNo );
                objUri.addSearch( 'LineItemNo', imgr2.LineItemNo );
                ApiService.Get( objUri, false ).then( function success( result ) {} );
            }
            $ionicLoading.hide();
            PopupService.Info( popup, 'Comfirm Success' ).then( function () {
                $scope.clear();
                $scope.returnMain();
            } );
        };
        $scope.refreshRcbp1 = function ( BusinessPartyName ) {
            if ( is.not.undefined( BusinessPartyName ) && is.not.empty( BusinessPartyName ) ) {
                var objUri = ApiService.Uri( true, '/api/wms/rcbp1' );
                objUri.addSearch( 'BusinessPartyName', BusinessPartyName );
                ApiService.Get( objUri, false ).then( function success( result ) {
                    $scope.Rcbp1s = result.data.results;
                } );
            } else {
                $scope.clear();
            }
        };
        $scope.refreshGrnNos = function ( Grn ) {
            if ( is.not.undefined( Grn ) && is.not.empty( Grn ) ) {
                var objUri = ApiService.Uri( true, '/api/wms/imgr1' );
                objUri.addSearch( 'StatusCode', 'EXE' );
                objUri.addSearch( 'GoodsReceiptNoteNo', Grn );
                ApiService.Get( objUri, false ).then( function success( result ) {
                    $scope.GrnNos = result.data.results;
                } );
            } else {
                $scope.clear();
            }
        };
        $scope.showImgr1 = function ( Customer ) {
            if ( is.not.undefined( Customer ) && is.not.empty( Customer ) ) {
                var objUri = ApiService.Uri( true, '/api/wms/imgr1' );
                objUri.addSearch( 'StatusCode', 'EXE' );
                objUri.addSearch( 'CustomerCode', Customer );
                ApiService.Get( objUri, true ).then( function success( result ) {
                    $scope.clear();
                    $scope.Imgr1s = result.data.results;
                } );
            } else {
                $scope.clear();
            }
        };
        $scope.showDate = function ( utc ) {
            return moment( utc ).format( 'DD-MMM-YYYY' );
        };
        /*
        $scope.GoToDetail = function( Imgr1 ) {
            if ( Imgr1 != null ) {
                $state.go( 'putawayDetail', {
                    'CustomerCode': Imgr1.CustomerCode,
                    'TrxNo': Imgr1.TrxNo,
                    'GoodsReceiptNoteNo': Imgr1.GoodsReceiptNoteNo
                }, {
                    reload: true
                } );
            }
        };
        */
        $scope.showImgr2 = function ( GoodsReceiptNoteNo ) {
            if ( is.not.undefined( GoodsReceiptNoteNo ) && is.not.empty( GoodsReceiptNoteNo ) ) {
                var objUri = ApiService.Uri( true, '/api/wms/imgr2/putaway' );
                objUri.addSearch( 'GoodsReceiptNoteNo', GoodsReceiptNoteNo );
                ApiService.Get( objUri, true ).then( function success( result ) {
                    $scope.clear();
                    $scope.Imgr2s = result.data.results;
                    $( '#div-grt-list' ).focus();
                } );
            } else {
                $scope.clear();
            }
        };
        $scope.returnMain = function () {
            $state.go( 'index.main', {}, {
                reload: true
            } );
        };
        $scope.clear = function () {
            $scope.Imgr1s = {};
            $scope.Imgr2s = {};
        };
        $scope.openCam = function ( imgr2 ) {
            if(!ENV.fromWeb){
                $cordovaBarcodeScanner.scan().then( function ( imageData ) {
                    $scope.Imgr2s[ imgr2.LineItemNo - 1 ].StoreNo = imageData.text;
                    $( '#txt-storeno-' + imgr2.LineItemNo ).select();
                }, function ( error ) {
                    $cordovaToast.showShortBottom( error );
                } );
            }
        };
        $scope.clearInput = function ( imgr2 ) {
            $scope.Imgr2s[ imgr2.LineItemNo - 1 ].StoreNo = '';
            $( '#txt-storeno-' + imgr2.LineItemNo ).select();
        };
        $scope.checkConfirm = function () {
            $ionicLoading.show();
            var blnDiscrepancies = false;
            for ( var i = 0; i < $scope.Imgr2s.length; i++ ) {
                var imgr2 = {
                    TrxNo: $scope.Imgr2s[ i ].TrxNo,
                    LineItemNo: $scope.Imgr2s[ i ].LineItemNo,
                    ProductCode: $scope.Imgr2s[ i ].ProductCode,
                    StoreNo: $scope.Imgr2s[ i ].StoreNo
                };
                if ( is.empty( imgr2.StoreNo ) ) {
                    console.log( 'Product (' + imgr2.ProductCode + ') has no Store No to putaway' );
                    blnDiscrepancies = true;
                    break;
                }
            }
            if ( blnDiscrepancies ) {
                $ionicLoading.hide();
                PopupService.Alert( popup, 'Some Products Has Not Yet Putaway' ).then();
            } else {
                confirm();
            }
        };
    } ] );
/*
appControllers.controller( 'PutawayDetailCtrl', [ '$scope', '$stateParams', '$state', '$timeout', '$ionicHistory', '$ionicLoading', '$ionicPopup', '$ionicModal', '$cordovaToast', '$cordovaBarcodeScanner', 'ApiService',
    function ( $scope, $stateParams, $state, $timeout, $ionicHistory, $ionicLoading, $ionicPopup, $ionicModal, $cordovaToast, $cordovaBarcodeScanner, ApiService ) {
        var popup = null;
        var popupTitle = '';
        var hmImgr2 = new HashMap();
        var hmImsn1 = new HashMap();
        var arrStoreNo = null;
        var arrBarCode = null;
        $scope.Detail = {
            Scan: {
                Qty: 0,
                BarCode: '',
                SerialNo: '',
                StoreNo: ''
            },
            Customer: $stateParams.CustomerCode,
            GRN: $stateParams.GoodsReceiptNoteNo,
            TrxNo: $stateParams.TrxNo,
            Impr1: {},
            Imgr2s: {},
            Imgr2sDb: {},
            Whwh2s: {}
        };
        $ionicModal.fromTemplateUrl( 'scan.html', {
            scope: $scope,
            animation: 'slide-in-up'
        } ).then( function ( modal ) {
            $scope.modal = modal;
        } );
        $scope.$on( '$destroy', function () {
            $scope.modal.remove();
        } );
        var setScanQty = function ( barcode, imgr2 ) {
            if ( imgr2.SerialNoFlag != null && imgr2.SerialNoFlag === 'Y' ) {
                $scope.Detail.Scan.Qty = imgr2.ScanQty;
                $( '#txt-sn' ).removeAttr( 'readonly' );
                $( '#txt-sn' ).select();
            } else {
                imgr2.ScanQty += 1;
                imgr2.StoreNo = $scope.Detail.Scan.StoreNo;
                hmImgr2.remove( barcode );
                hmImgr2.set( barcode, imgr2 );
                $scope.Detail.Scan.Qty = imgr2.ScanQty;
                $scope.Detail.Scan.BarCode = '';
                db_update_Imgr2_Putaway( imgr2 );
            }
        };
        var showImpr = function ( barcode ) {
            if ( hmImgr2.count() > 0 && hmImgr2.has( barcode ) ) {
                var imgr2 = hmImgr2.get( barcode );
                $scope.Detail.Impr1.ProductCode = imgr2.ProductCode;
                $scope.Detail.Impr1.ProductDescription = imgr2.ProductDescription;
                setScanQty( barcode, imgr2 );
                $scope.$apply();
            }
        };
        var checkSn = function ( sn, SnArray ) {
            var blnExistSn = false;
            for ( var i = 0; i < SnArray.length; i++ ) {
                if ( SnArray[ i ].toString() === sn ) {
                    blnExistSn = true;
                    break;
                }
            }
            return blnExistSn;
        };
        var setSnQty = function ( sn, SnArray, mapValue ) {
            if ( SnArray.length > 1 ) {
                if ( checkSn( sn, SnArray ) ) {
                    return;
                }
            }
            SnArray.push( sn );
            hmImsn1.remove( $scope.Detail.Scan.BarCode );
            hmImsn1.set( $scope.Detail.Scan.BarCode, SnArray );
            mapValue.ScanQty += 1;
            hmImgr2.remove( $scope.Detail.Scan.BarCode );
            hmImgr2.set( $scope.Detail.Scan.BarCode, mapValue );
            $scope.Detail.Scan.Qty = mapValue.ScanQty;
            $scope.$apply();
            //if ( dbWms ) {
            //    dbWms.transaction( function( tx ) {
            //        dbSql = 'INSERT INTO Imsn1_Putaway (ReceiptNoteNo, ReceiptLineItemNo, SerialNo) values(?, ?, ?)';
            //        tx.executeSql( dbSql, [ $scope.Detail.GRN, mapValue.LineItemNo, sn ], null, null );
            //        dbSql = 'Update Imgr2_Putaway set ScanQty=? Where TrxNo=? and LineItemNo=?';
            //        tx.executeSql( dbSql, [ mapValue.ScanQty, mapValue.TrxNo, mapValue.LineItemNo ], null, dbError );
            //    } );
            //}
            $( '#txt-sn' ).select();
        };
        var ShowSn = function ( sn, blnScan ) {
            if ( sn != null && sn > 0 ) {
                if ( blnScan ) {
                    $scope.Detail.Scan.SerialNo = sn;
                }
                var mapBcValue = hmImgr2.get( $scope.Detail.Scan.BarCode );
                var SnArray = null;
                if ( hmImsn1.count() > 0 ) {
                    if ( hmImsn1.has( $scope.Detail.Scan.BarCode ) ) {
                        SnArray = hmImsn1.get( $scope.Detail.Scan.BarCode );
                    } else {
                        SnArray = new Array();
                        SnArray.push( sn );
                        hmImsn1.set( $scope.Detail.Scan.BarCode, SnArray );
                    }
                } else {
                    SnArray = new Array();
                    SnArray.push( sn );
                    hmImsn1.set( $scope.Detail.Scan.BarCode, SnArray );
                }
                setSnQty( sn, SnArray, mapBcValue );
            }
        };
        var confirm = function () {
            $ionicLoading.show();
            if ( dbWms ) {
                dbWms.transaction( function ( tx ) {
                    dbSql = 'Select * from Imgr2_Putaway';
                    tx.executeSql( dbSql, [], function ( tx, results ) {
                        var len = results.rows.length;
                        if ( len > 0 ) {
                            for ( var i = 0; i < len; i++ ) {
                                var strUri = '/api/wms/imgr2/putaway/update?StoreNo=' + results.rows.item( i ).StoreNo + '&TrxNo=' + results.rows.item( i ).TrxNo + '&LineItemNo=' + results.rows.item( i ).LineItemNo;
                                ApiService.Get( strUri, false ).then( function success( result ) {

                                } );
                            }
                            $ionicLoading.hide();
                            var popup = $ionicPopup.alert( {
                                title: 'Comfirm success.',
                                okType: 'button-calm'
                            } );
                            $timeout( function () {
                                popup.close();
                                $scope.returnList();
                            }, 2500 );
                        }
                    }, dbError );
                } );
            }
        };
        var checkBarCode = function ( barcode ) {
            var blnNoError = false;
            if ( is.inArray( barcode, arrBarCode ) ) {
                blnNoError = true;
            } else {
                popup = $ionicPopup.alert( {
                    title: 'Wrong Product.',
                    subTitle: 'It not belongs to this GRN.',
                    okType: 'button-assertive'
                } );
            }
            return blnNoError;
        }
        var GetImgr2s = function ( GoodsReceiptNoteNo ) {
            var strUri = '/api/wms/imgr2/putaway?GoodsReceiptNoteNo=' + GoodsReceiptNoteNo;
            ApiService.Get( strUri, true ).then( function success( result ) {
                $scope.Detail.Imgr2s = result.data.results;
                db_del_Imgr2_Putaway();
                arrStoreNo = new Array();
                arrBarCode = new Array();
                if ( is.array( $scope.Detail.Imgr2s ) && is.not.empty( $scope.Detail.Imgr2s ) ) {
                    for ( var i = 0; i < $scope.Detail.Imgr2s.length; i++ ) {
                        var storeno = $scope.Detail.Imgr2s[ i ].StoreNo;
                        if ( !is.inArray( storeno, arrStoreNo ) ) {
                            arrStoreNo.push( storeno );
                        }
                        var barcode = $scope.Detail.Imgr2s[ i ].BarCode;
                        if ( !is.inArray( barcode, arrBarCode ) ) {
                            arrBarCode.push( barcode );
                        }
                        var imgr2_Db = {
                            TrxNo: $scope.Detail.Imgr2s[ i ].TrxNo,
                            LineItemNo: $scope.Detail.Imgr2s[ i ].LineItemNo,
                            StoreNo: $scope.Detail.Imgr2s[ i ].StoreNo,
                            ProductCode: $scope.Detail.Imgr2s[ i ].ProductCode,
                            ProductDescription: $scope.Detail.Imgr2s[ i ].ProductDescription,
                            ScanQty: 0
                        }
                        hmImgr2.set( barcode, imgr2_Db );
                        db_add_Imgr2_Putaway( $scope.Detail.Imgr2s[ i ] );
                    }
                }
            } );
        };
        $scope.openCam = function ( type ) {
            if ( is.equal( type, 'StoreNo' ) ) {
                $cordovaBarcodeScanner.scan().then( function ( imageData ) {
                    $scope.Detail.Scan.StoreNo = imageData.text;
                    $( '#txt-barcode' ).focus();
                }, function ( error ) {
                    $cordovaToast.showShortBottom( error );
                } );
            } else if ( is.equal( type, 'BarCode' ) ) {
                $cordovaBarcodeScanner.scan().then( function ( imageData ) {
                    $scope.Detail.Scan.BarCode = imageData.text;
                    ShowProduct( $scope.Detail.Scan.BarCode, true );
                }, function ( error ) {
                    $cordovaToast.showShortBottom( error );
                } );
            } else if ( is.equal( type, 'SerialNo' ) ) {
                if ( $( '#txt-sn' ).attr( 'readonly' ) != 'readonly' ) {
                    $cordovaBarcodeScanner.scan().then( function ( imageData ) {
                        $scope.Detail.Scan.SerialNo = imageData.text;
                        ShowSn( $scope.Detail.Scan.SerialNo, false );
                    }, function ( error ) {
                        $cordovaToast.showShortBottom( error );
                    } );
                }
            }
        };
        $scope.openModal = function () {
            $scope.modal.show();
            $ionicLoading.show();
            if ( dbWms ) {
                dbWms.transaction( function ( tx ) {
                    dbSql = 'Select * from Imgr2_Putaway';
                    tx.executeSql( dbSql, [], function ( tx, results ) {
                        $scope.Detail.Imgr2sDb = new Array();
                        for ( var i = 0; i < results.rows.length; i++ ) {
                            var imgr2 = {
                                TrxNo: results.rows.item( i ).TrxNo,
                                LineItemNo: results.rows.item( i ).LineItemNo,
                                StoreNo: results.rows.item( i ).StoreNo,
                                ProductCode: results.rows.item( i ).ProductCode,
                                ScanQty: results.rows.item( i ).ScanQty > 0 ? results.rows.item( i ).ScanQty : 0,
                                BarCode: results.rows.item( i ).BarCode,
                                ActualQty: 0
                            };
                            switch ( results.rows.item( i ).DimensionFlag ) {
                            case '1':
                                imgr2.ActualQty = results.rows.item( i ).PackingQty;
                                break;
                            case '2':
                                imgr2.ActualQty = results.rows.item( i ).WholeQty;
                                break;
                            default:
                                imgr2.ActualQty = results.rows.item( i ).LooseQty;
                            }
                            $scope.Detail.Imgr2sDb.push( imgr2 );
                        }
                        $ionicLoading.hide();
                    }, dbError )
                } );
            }
        };
        $scope.closeModal = function () {
            $scope.Detail.Imgr2sDb = {};
            $scope.modal.hide();
        };
        $scope.returnList = function () {
            if ( $ionicHistory.backView() ) {
                $ionicHistory.goBack();
            } else {
                $state.go( 'putawayList', {}, {
                    reload: true
                } );
            }
        };
        $scope.clearInput = function ( type ) {
            if ( is.equal( type, 'StoreNo' ) ) {
                $scope.Detail.Scan.StoreNo = '';
                $( '#txt-storeno' ).select();
            } else if ( is.equal( type, 'BarCode' ) ) {
                $scope.Detail.Scan.BarCode = '';
                $scope.Detail.Scan.SerialNo = '';
                $scope.Detail.Scan.Qty = 0;
                $scope.Detail.Impr1 = {};
                $( '#txt-sn' ).attr( 'readonly', true );
                $( '#txt-barcode' ).select();
            } else if ( is.equal( type, 'SerialNo' ) ) {
                $scope.Detail.Scan.SerialNo = '';
                $( '#txt-sn' ).select();
            }
        };
        $scope.changeQty = function () {
            if ( $scope.Detail.Scan.Qty > 0 && $scope.Detail.Scan.BarCode.length > 0 ) {
                if ( hmImgr2.count() > 0 && hmImgr2.has( $scope.Detail.Scan.BarCode ) ) {
                    var imgr2 = hmImgr2.get( $scope.Detail.Scan.BarCode );
                    var promptPopup = $ionicPopup.show( {
                        template: '<input type="number" ng-model="Detail.Scan.Qty">',
                        title: 'Enter Qty',
                        subTitle: 'Are you sure to change Qty manually?',
                        scope: $scope,
                        buttons: [ {
                            text: 'Cancel'
                        }, {
                            text: '<b>Save</b>',
                            type: 'button-positive',
                            onTap: function ( e ) {
                                imgr2.ScanQty = $scope.Detail.Scan.Qty;
                                db_update_Imgr2_Putaway( imgr2 );
                            }
                        } ]
                    } );
                }
            }
        };
        $scope.checkConfirm = function () {
            if ( dbWms ) {
                dbWms.transaction( function ( tx ) {
                    dbSql = 'Select * from Imgr2_Putaway';
                    tx.executeSql( dbSql, [], function ( tx, results ) {
                        var len = results.rows.length;
                        if ( len > 0 ) {
                            $ionicLoading.show();
                            var blnDiscrepancies = false;
                            for ( var i = 0; i < len; i++ ) {
                                var imgr2 = {
                                    TrxNo: results.rows.item( i ).TrxNo,
                                    LineItemNo: results.rows.item( i ).LineItemNo,
                                    ProductCode: results.rows.item( i ).ProductCode,
                                    ScanQty: results.rows.item( i ).ScanQty,
                                    BarCode: results.rows.item( i ).BarCode,
                                    Qty: 0
                                };
                                switch ( results.rows.item( i ).DimensionFlag ) {
                                case '1':
                                    imgr2.Qty = results.rows.item( i ).PackingQty;
                                    break;
                                case '2':
                                    imgr2.Qty = results.rows.item( i ).WholeQty;
                                    break;
                                default:
                                    imgr2.Qty = results.rows.item( i ).LooseQty;
                                }
                                if ( imgr2.Qty != imgr2.ScanQty ) {
                                    console.log( 'Product (' + imgr2.ProductCode + ') Qty not equal.' );
                                    blnDiscrepancies = true;
                                    break;
                                }
                            }
                            if ( blnDiscrepancies ) {
                                $ionicLoading.hide();
                                var checkPopup = $ionicPopup.show( {
                                    title: 'The following product has not yet putaway.',
                                    buttons: [ {
                                        text: '<b>Check</b>',
                                        type: 'button-assertive',
                                        onTap: function ( e ) {
                                            $timeout( function () {
                                                $scope.openModal();
                                            }, 250 );
                                            checkPopup.close();
                                        }
                                    } ]
                                } );
                            } else {
                                confirm();
                            }
                        }
                    }, dbError )
                } );
            }
        };
        GetImgr2s( $scope.Detail.GRN );
        $( '#txt-storeno' ).on( 'keydown', function ( e ) {
            if ( e.which === 9 || e.which === 13 ) {
                if ( popup === null ) {
                    $( '#txt-barcode' ).focus();
                } else {
                    popup.close();
                    popup = null;
                }
            }
        } );
        $( '#txt-barcode' ).on( 'keydown', function ( e ) {
            if ( e.which === 9 || e.which === 13 ) {
                if ( popup === null ) {
                    if ( checkBarCode( $scope.Detail.Scan.BarCode ) ) {
                        showImpr( $scope.Detail.Scan.BarCode );
                    } else {
                        $( '#txt-barcode' ).focus();
                    }
                } else {
                    popup.close();
                    popup = null;
                }
            }
        } );
        $( '#txt-sn' ).on( 'keydown', function ( e ) {
            if ( e.which === 9 || e.which === 13 ) {
                if ( popup === null ) {
                    ShowSn( $scope.Detail.Scan.SerialNo, false );
                } else {
                    popup.close();
                    popup = null;
                }
            }
        } );
    } ] );
*/
