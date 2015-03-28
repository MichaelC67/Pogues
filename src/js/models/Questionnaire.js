"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
The class for a Questionnaire
*/

var SequenceModel = _interopRequire(require("./Sequence.js"));

var SurveyModel = _interopRequire(require("./Survey.js"));

var QuestionnaireModel = (function (_SequenceModel) {
  function QuestionnaireModel() {
    _classCallCheck(this, QuestionnaireModel);

    _get(Object.getPrototypeOf(QuestionnaireModel.prototype), "constructor", this).call(this);
    this._survey = new SurveyModel();
  }

  _inherits(QuestionnaireModel, _SequenceModel);

  _createClass(QuestionnaireModel, {
    survey: {
      get: function () {
        return this._survey;
      },
      set: function (survey) {
        if (!(survey instanceof SurveyModel)) {
          throw new Error("The argument must be a Survey");
        }
        this._survey = survey;
      }
    }
  });

  return QuestionnaireModel;
})(SequenceModel);

module.exports = QuestionnaireModel;