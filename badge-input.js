(function() {
    "use strict";

    const TRIGGER_KEYS = ["Enter", "Tab", ","];

    var template = document.createElement("template");
    template.innerHTML = `
        <style>
            ul {
                list-style-type: none;
                padding: 0;
                margin: 0;
            }

            input {
                width: 100%;
                height: 45px;
                padding: 0 1rem;
                margin-top: 1rem;
                box-sizing: border-box;
                font: inherit;
                border-radius: 0.2rem;
                border: 2px solid #d4d5d6;
                color: #565656;
                -webkit-appearance: none;
              }

              input:focus {
                border-color: cornflowerblue;
                outline: none;
              }
        
              input.has-error {
                border-color: tomato;
              }

              p {
                margin: 0;
                font-size: 90%;
                color: tomato;
              }
        
              li {
                background-color: #d4d5d6;
                display: inline-block;
                font-size: 14px;
                border-radius: 30px;
                height: 30px;
                padding: 0 4px 0 1rem;
                display: inline-flex;
                align-items: center;
                margin: 0 0.3rem 0.3rem 0;
              }

              li > button {
                background-color: white;
                width: 22px;
                height: 22px;
                border-radius: 50%;
                border: none;
                cursor: pointer;
                font: inherit;
                margin-left: 10px;
                font-weight: bold;
                padding: 0;
                line-height: 1;
                display: flex;
                align-items: center;
                justify-content: center;
              }

        </style>

        <ul></ul>
        <input type="email" placeholder="Type or paste email addresses and press 'Enter'...">
        <p hidden></p>  
    `;


    class BadgeInput extends HTMLElement {
        constructor(){
            super();

            this._shadow = this.attachShadow({mode: "open"});
            this._shadow.appendChild(template.content.cloneNode(true));

            this._items=[];

            this._input = this._shadow.querySelector("input");
            this._error = this._shadow.querySelector("p");
            this._list = this._shadow.querySelector("ul");
        }

        connectedCallback() {
            this._input.addEventListener("keydown", this.handleKeyDown);
            this._input.addEventListener("paste", this.handlePaste);
            this._list.addEventListener("click", this.handleDelete);
        }

        disconnectedCallback() {
            this._input.removeEventListener("keydown", this.handleKeyDown);
            this._input.removeEventListener("paste", this.handlePaste);
            this._list.removeEventListener("click", this.handleDelete);
        }

        handleKeyDown = (evt) => {
            
            this._error.setAttribute("hidden", true);
            this._input.classList.remove("has-error");

            if(TRIGGER_KEYS.includes(evt.key)){
                evt.preventDefault();

                var value = evt.target.value.trim();

                if(value && this.validate(value)){
                    evt.target.value = " ";

                    this._items.push(value);                                    
                    this.update();
                }
            }
        };

        validate(email){
            var error = null;

            if(this.isInList(email)) {
                error = `${ email } has already been added`;
            }

            if(!this.isEmail(email)){
                error = `${ email } is not a valid email address`;
            };

            if(error){
                this._error.textContent = error;
                this._error.removeAttribute("hidden");
                this._input.classList.add("has-error");

                return false;   
            }

            return true;
        }

        update(){            
            this._list.innerHtml = this._items            
            .map(function(item){               
              return `
                <li>
                    ${ item }
                    <button type="button" data-value="${item}">&times;</button>
                </li>
              `;
            }).join("");
        }

        isInList(email){
            return this._items.includes(email);
        }

        isEmail(email){
            return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
        }
    }

    customElements.define("badge-input", BadgeInput);

}) ();