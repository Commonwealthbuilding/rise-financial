( function financial() {
  /* global Polymer, financialVersion, firebase, config */

  "use strict";

  var BQ_TABLE_NAME = "component_financial_events";

  class RiseFinancial {

    beforeRegister() {
      this.is = "rise-financial";

      this.properties = {
        /**
         * The optional usage type for Rise Vision logging purposes. Options are "standalone" or "widget"
         */
        usage: {
          type: String,
          value: ""
        },

        /**
         * ID of the financial list in Financial Selector.
         */
        financialList: {
          type: String,
          value: ""
        },

        /**
         * The list of instruments fields the component should return data for
         */
        instrumentFields: {
          type: Array,
          value: () => {
            return [];
          }
        },

        /**
         * The id of the display running this instance of the component.
         */
        displayId: {
          type: String,
          readOnly: true,
          value: "preview"
        }

      };

      this._displayIdReceived = false;
      this._goPending = false;
    }

    _isValidUsage( usage ) {
      return usage === "standalone" || usage === "widget";
    }

    _onDisplayIdReceived( displayId ) {
      this._displayIdReceived = true;

      if ( displayId && typeof displayId === "string" ) {
        this._setDisplayId( displayId );
      }

      if ( this._goPending ) {
        this._goPending = false;
        this.go();
      }
    }

    _getInstruments() {
      if ( !this.financialList ) {
        return;
      }

      this._instrumentsRef = firebase.database().ref( `lists/${ this.financialList }/instruments` );
      this._instrumentsRef.on( "value", this._handleInstruments );
    }

    _handleInstruments( snapshot ) {
      // TODO: Make request to financial server.
      console.log( snapshot.val() );  // eslint-disable-line no-console
    }

    ready() {
      let params = {
        event: "ready"
      };

      if ( !this._firebaseApp ) {
        this._firebaseApp = firebase.initializeApp( config );
      }

      // listen for logger display id received
      this.$.logger.addEventListener( "rise-logger-display-id", ( e ) => {
        this._onDisplayIdReceived( e.detail );
      } );

      // only include usage_type if it's a valid usage value
      if ( this._isValidUsage( this.usage ) ) {
        params.usage_type = this.usage;
      }

      params.version = financialVersion;

      // log usage
      this.$.logger.log( BQ_TABLE_NAME, params );
    }

    attached() {
      this._getInstruments();
    }

    detached() {
      this._instrumentsRef.off( "value", this._handleInstruments );
    }

    go() {
      if ( this._displayIdReceived ) {
        // TODO
      } else {
        this._goPending = true;
      }
    }
  }

  Polymer( RiseFinancial );

} )();
