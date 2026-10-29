<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class AerodromoIndexRequest extends FormRequest {
 public function authorize():bool{return true;}
 public function rules():array{return ['q'=>['nullable','string','max:120'],'provincia'=>['nullable','string','max:100'],'tipo'=>['nullable','string','max:100'],'sort'=>['nullable','in:nombre,provincia,tipo'],'direction'=>['nullable','in:asc,desc'],'per_page'=>['nullable','integer','min:1','max:100']];}
}
