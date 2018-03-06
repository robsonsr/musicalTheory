var meuApp = angular.module("meuApp",[]);

meuApp.controller("escalaController",function($scope, $rootScope, $http){

  $http.get("assets/database/escalas.json")
  .then(function(response){

      $scope.nomeEscalaArray = response.data;
      $rootScope.escalaSelecionada = $scope.nomeEscalaArray[0];

      $scope.escolherEscala = function(escala){
        $rootScope.escalaSelecionada = escala;
      }

      //a exibição das harmonicas depende da escala selecionada
      $http.get("assets/database/harmonicas.json")
      .then(function(response){
        if($rootScope.escalaSelecionada=="maior"){
          var array = [];
          array.push(response.data[0]);
          $rootScope.harmonicaArray = array;
          $rootScope.harmonicaSelecinada = $rootScope.harmonicaArray[0];
        }
      });

  }, function(response){
    $scope.data = response.data || "Resquest failed";
    $scope.status = response.status;
    console.log($scope.data);
    console.log($scope.status);
  });

});

meuApp.controller("notaController",function($scope, $rootScope, $http){
  $http.get("assets/database/notas.json")
  .then(function(response){
    $scope.notasArray = response.data;
    $rootScope.notaSelecionada = $scope.notasArray[0].simbolo;

    $scope.escolherNota = function(nota){
      $rootScope.notaSelecionada = nota.simbolo;
    }
    $http.get("assets/database/escala_"+$rootScope.escalaSelecionada+".json")
    .then(function(response){
    });
  });
});

meuApp.controller("harmonicaController", function($scope, $rootScope){
  $scope.escolherHarmonica = function(harmonica){
    $rootScope.harmonicaSelecionada = harmonica;
  }
  
});

meuApp.run(function($rootScope, $http, $window){
  $rootScope.escalaSelecionada = "maior";
  $rootScope.notaSelecionada = "C";
  $rootScope.harmonicaSelecionada = "maior";
  

  /*montar o array com a nota e escala selecionada para ser
  exibida na view*/
  $rootScope.montarEscala = function(escalaSelecionada, notaSelecionada){
    $http.get("assets/database/escala_"+escalaSelecionada+".json")
    .then(function(response){
        /* verificar a notas pertencentes a escala e montar um array com as escalas
        do arquivo notas.json por que neste arquivos as notas possuem detalhes
        como a mídia de som, simbolo e nome*/
        var escalas = response.data[notaSelecionada];
        $rootScope.escala = [];
        $http.get("assets/database/notas.json")
        .then(function(response){
          var notas = response.data;
          for(indiceEscala in escalas){
            for(indiceNota in notas){
              if(notas[indiceNota].simbolo == escalas[indiceEscala]){
                $rootScope.escala.push(notas[indiceNota]);
              }
            }
          }
        });  
    });
  }
  
  $rootScope.montarHarmonica = function(harmonicaSelecionada, notaSelecionada){
      $http.get("assets/database/harmonica_"+harmonicaSelecionada+".json")
      .then(function(response){
          var harmonica = response.data[notaSelecionada];
          $rootScope.harmonica=[];
          $http.get("assets/database/acordes.json")
          .then(function(response){
            var acordes = response.data;
            for(indiceHarmonica in harmonica){
              for(indice in acordes){
                if(harmonica[indiceHarmonica] == acordes[indice].acorde){
                  $rootScope.harmonica.push(acordes[indice]);
                }
              }
            }
          });
      });
      
  }

  
  
  $rootScope.tocarNota = function(nota){
    var audio = $window.document.getElementById("audio-escala-"+nota);
    audio.load();
    audio.play();
  }

  $rootScope.tocarAcorde = function(acorde){
    var audios = $window.document.getElementsByClassName("audio-harmonica-"+acorde);
    for(i=0; i<audios.length; i++){
      audios[i].load();
      audios[i].play();
    }
    
  }


  $rootScope.montarEscala($rootScope.escalaSelecionada, $rootScope.notaSelecionada);
  $rootScope.montarHarmonica($rootScope.harmonicaSelecionada, $rootScope.notaSelecionada);

});
