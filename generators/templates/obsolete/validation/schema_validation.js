'use strict';
const Validator = require('jsonschema').Validator;

function validation() {
  let v = new Validator();
  const schema = [
    getHeadersValidation(),
    getIdentityValidation(),
    getEmailValidation(),
    getFormValidation(),
    getBodyValidation()
  ];

  const  payloadformat = {
    'type': 'object',
    'properties': {
      'body': {
        '$ref': '/body'
      },
      'identity': {
        '$ref': '/identity'
      },
      'headers': {
        '$ref': '/headers'
      }
    },
    'minProperties': 3,
    'required': ['body', 'identity', 'headers']
  };

  schema.forEach((current) => {
    v.addSchema(current, current.id);
  });

  return {
    'validator': v,
    'payloadformat': payloadformat
  };
}

module.exports = validation();

function getBodyValidation() {
  return {
    'id': '/body',
    'type': 'object',
    'properties': {
      'payload': {
        '$ref': '/FormV2.1.1'
      }
    },
    'required': ['payload']
  };
}

function getIdentityValidation() {
  return {
    'id': '/identity',
    'type': 'object'
  };
}

function getHeadersValidation() {
  return {
    'id': '/headers',
    'type': 'object'
  };
}

function getEmailValidation() {
  return {
    'id': '/email',
    'type': 'string',
    'maxLength': 255,
    'pattern': /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  };
}

function getFormValidation() {
  return {
    'id': '/FormV2.1.1',
    'type': 'object',
    'properties': {
      'browserVersion': {
        'type': 'string',
        'minLength': 1
      },
      'browserName': {
        'type': 'string',
        'minLength': 1
      },
      'systemName': {
        'type': 'string',
        'minLength': 1
      },
      'deviceModel': {
        'type': 'string',
        'minLength': 1
      },
      'id': {
        'type': 'string',
        'required': true,
        'minLength': 1
      },
      'url': {
        'type': 'string',
        'minLength': 1
      },
      'systemVersion': {
        'type': 'string',
        'minLength': 1
      },
      'formVersion': {
        'type': 'string',
        'minLength': 1
      },
      'userParticipatingContest': {
        'type': 'boolean'
      },
      'urlUserId': {
        'type': 'string',
        'minLength': 1
      },
      'providerId': {
        'type': 'integer',
        'required': true
      },
      'providerName': {
        'type': 'string',
        'required': true,
        'minLength': 1
      },
      'courseId': {
        'type': 'integer',
        'required': true
      },
      'courseName': {
        'type': 'string',
        'required': true,
        'minLength': 1
      },
      'studyStatus': {
        'enum': [
          'finished_course',
          'in_progress_course',
          'not_finished_course'
        ]
      },
      'studyStatusYearStart': {
        'type': 'integer'
      },
      'studyStatusYearFinal': {
        'type': 'integer'
      },
      'valuationRecommendation': {
        'type': 'boolean'
      },
      'email': {
        '$ref': '/email'
      },
      'valuationCourseRating': {
        'enum': [
          'rating_1',
          'rating_2',
          'rating_3',
          'rating_4',
          'rating_5'
        ]
      },
      'valuationCourseGoodMethodology': {
        'type': 'boolean'
      },
      'valuationCourseDynamicClasses': {
        'type': 'boolean'
      },
      'valuationCourseFeltMotivated': {
        'type': 'boolean'
      },
      'valuationCourseExamsHelpedToLearn': {
        'type': 'boolean'
      },
      'valuationCourseTaughtWhatWasExpected': {
        'type': 'boolean'
      },
      'valuationCourseRelevantAndFreshContent': {
        'type': 'boolean'
      },
      'valuationCourseBalanceBetweenTheoryAndPractice': {
        'type': 'boolean'
      },
      'valuationCourseDisciplinesWereDifficult': {
        'type': 'boolean'
      },
      'valuationCourseKnowledgeUsefulForWork': {
        'type': 'boolean'
      },
      'valuationCourseMoreAcademicThanProfessional': {
        'type': 'boolean'
      },
      'valuationCourseGoodSupportForStudents': {
        'type': 'boolean'
      },
      'valuationCourseProfessorsWithGoodExperienceDidactic': {
        'type': 'boolean'
      },
      'valuationCourseGoodStudyMaterial': {
        'type': 'boolean'
      },
      'valuationCourseGoodNetworking': {
        'type': 'boolean'
      },
      'valuationCoursePossibleStudyAndWork': {
        'type': 'boolean'
      },
      'valuationCourseHasFlexibleHours': {
        'type': 'boolean'
      },
      'careerImpactRating': {
        'enum': [
          'rating_1',
          'rating_2',
          'rating_3',
          'rating_4',
          'rating_5'
        ]
      },
      'sameCareerFieldAsStudied': {
        'enum': [
          'yes',
          'more_or_less',
          'no'
        ]
      },
      'careerImpactValorization': {
        'enum': [
          'strongly_disagree',
          'disagree',
          'agree',
          'strongly_agree'
        ]
      },
      'careerImpactLearning': {
        'enum': [
          'strongly_disagree',
          'disagree',
          'agree',
          'strongly_agree'
        ]
      },
      'careerImpactMarketValue': {
        'enum': [
          'strongly_disagree',
          'disagree',
          'agree',
          'strongly_agree'
        ]
      },
      'careerImpactJobChance': {
        'enum': [
          'strongly_disagree',
          'disagree',
          'agree',
          'strongly_agree'
        ]
      },
      'careerImpactSelfImprovement': {
        'enum': [
          'strongly_disagree',
          'disagree',
          'agree',
          'strongly_agree'
        ]
      },
      'careerImpactFullFilling': {
        'enum': [
          'strongly_disagree',
          'disagree',
          'agree',
          'strongly_agree'
        ]
      },
      'courseClassesTime': {
        'enum': [
          'classes_morning_time',
          'classes_afternoon_time',
          'classes_evening_time',
          'classes_full_time'
        ]
      },
      'courseAttendance': {
        'enum': [
          'course_attended_locally',
          'course_attended_online',
          'course_attended_both_locally_online'
        ]
      },
      'courseScholarship': {
        'enum': [
          'free_course',
          'full_scholarship',
          'partial_scholarship',
          'no_scholarship'
        ]
      },
      'courseLastMonthPaymentValue': {
        'type': 'integer',
        'minimum': 0
      },
      'courseCostBenefits': {
        'enum': [
          'worst',
          'bad',
          'good',
          'best'
        ]
      },
      'providerChoice': {
        'enum': [
          'most_wanted_option',
          'one_of_the_good_options',
          'only_available_option'
        ]
      },
      'experienceGoodParts': {
        'type': 'string',
        'minLength': 1,
        'maxLength': 10000
      },
      'experienceBadParts': {
        'type': 'string',
        'minLength': 1,
        'maxLength': 10000
      },
      'experienceReviewTitle': {
        'type': 'string',
        'minLength': 1,
        'maxLength': 255
      }
    },
    'additionalProperties': false
  };
}
