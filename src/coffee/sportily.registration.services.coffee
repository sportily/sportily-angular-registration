module = angular.module('sportily.registration.services', []);

module.factory 'StripeService', ($q, StripePublishableKey) ->
      return {
          getOneTimeToken: (amount, email) ->
              deferred = $q.defer()
              handler = StripeCheckout.configure({
                   key: StripePublishableKey,
                   name: "Pay League Fees",
                   allowRememberMe: false,
                   email: email,
                   token: (token, args) ->
                     deferred.resolve(token);
                   ,
                   closed: ->
                     deferred.reject("form.closed");

              })

              options = {
                description: "Sportily League Fees",
                zipCode: true,
                currency: "gbp",
                amount: amount
              }

              handler.open(options);
              return deferred.promise;

        }

module.factory 'PaymentService', ($q, Transactions, Payments) ->
       getNational = (member) ->
          orgs = null
          national = [];
          orgs = member.financial_summary.owed.organisations;
          Object.getOwnPropertyNames(orgs).forEach((prop) ->
             if (orgs[prop].type == 'national')
               orgs[prop].id = prop;
               national = orgs[prop];
          );
          return national;


        getRegionals = (member) ->
          orgs = null;
          regions = [];
          orgs = member.financial_summary.owed.organisations;
          Object.getOwnPropertyNames(orgs).forEach((prop) ->
             if (orgs[prop].type == 'regional')
               orgs[prop].id = prop;
               regions.push(orgs[prop]);

          );
          return regions;

        return {
            take: (stripeToken, member, amount) ->
              national = getNational(member);
              regions = getRegionals(member);
              promises = regions.map((region) ->

                  return Transactions.post({
                      type: 'standard',
                      amount: region.total,
                      source_id: member.id,
                      target_id: null,
                      status: 'pending',
                      organisation_id: region.id,
                      target_organisation_id: national.id,
                      method: "online"
                  });

              );
              nationalPromise = Transactions.post({
                  type: 'standard',
                  amount: national.total,
                  source_id: member.id,
                  target_id: null,
                  status: 'pending',
                  organisation_id: national.id,
                  target_organisation_id: null,
                  method: "online"
              });
              promises.push(nationalPromise);

              return $q.all(promises).then((transactions) ->
                  return Payments.post({
                    amount: member.financial_summary.owed.total,
                    organisation_id: national.id,
                    stripe_payment_token: stripeToken.id,
                    transaction_ids: transactions.map((transaction) ->  return transaction.id; )
                  });
              );
        }
